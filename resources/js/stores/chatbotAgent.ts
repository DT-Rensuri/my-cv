import { ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import { agent, voiceMeetingAgent, suriVTubeAgent } from '@/services/langchain';
import type { LanguageOption } from '@/types/chat';
import { useAvatarStore } from './avatar';
import { useSpeech } from '@/composables/useSpeech';

export type AgentMessage = { role: string; content: string };

export const useChatbotAgentStore = defineStore('chatbot-agent', () => {
    const { speak, stopSpeech } = useSpeech();
    const response = ref<string | null>(null);
    const loading = ref(false);
    const enableSuggestions = ref(true);
    const suggestions = ref<string[]>([]);

    const streamOutput = ref<string>('');
    const thinkingOutput = ref<string>('');
    const isStreaming = ref(false);
    const isThinking = ref(false);
    const selectedLanguage = ref<LanguageOption>({
        code: 'vi',
        name: 'Vietnamese',
    });
    const agentTone = ref<string>('friendly');
    const agentResponseLength = ref<string>('balanced');
    const agentResponseFormat = ref<string>('plain_text');
    const agentTechnicalLevel = ref<string>('adaptive');
    const agentProactivity = ref<string>('normal');
    const agentPersonality = ref<string>(
        'I am a helpful and friendly assistant.',
    );
    const selectedAgent = ref('default');
    const isSuriVTube = computed(
        () => selectedAgent.value === 'suriVTubeAgent',
    );
    const stackStreamOutput = ref('');

    function resetStream() {
        streamOutput.value = '';
        thinkingOutput.value = '';
        isStreaming.value = false;
        isThinking.value = false;
        enableSuggestions.value = false;
        suggestions.value = [];
    }

    function getAgentInstance() {
        switch (selectedAgent.value) {
            case 'voiceMeetingAgent':
                return voiceMeetingAgent;
            case 'suriVTubeAgent':
                return suriVTubeAgent;
            default:
                return agent;
        }
    }

    async function invokeAgent(message: AgentMessage): Promise<string | null> {
        loading.value = true;
        response.value = null;
        try {
            const result = await getAgentInstance().invoke(
                { messages: [message] },
                { configurable: { thread_id: 'chatbot-invoke' } },
            );

            if (result && result.messages && result.messages.length > 0) {
                const last = result.messages[result.messages.length - 1];
                const content = last?.content;
                const text =
                    typeof content === 'string'
                        ? content
                        : Array.isArray(content)
                          ? content
                                .map((c) =>
                                    typeof c === 'string' ? c : (c.text ?? ''),
                                )
                                .join('')
                          : '';
                response.value = text;
            }
        } catch (error) {
            console.error('Error invoking agent:', error);
            response.value = null;
        } finally {
            loading.value = false;
            return response.value;
        }
    }

    async function streamAgent(message: AgentMessage): Promise<string> {
        resetStream();

        loading.value = true;
        isStreaming.value = false;
        isThinking.value = false;

        try {
            const stream = await getAgentInstance().streamEvents(
                { messages: [message] },
                {
                    configurable: {
                        thread_id: 'chatbot-stream',
                    },
                },
            );

            for await (const event of stream) {
                switch (event.event) {
                    case 'on_chat_model_start': {
                        loading.value = true;
                        isStreaming.value = true;
                        break;
                    }

                    case 'on_chat_model_stream': {
                        handleStreamChunk(event.data?.chunk);
                        break;
                    }

                    case 'on_chat_model_end': {
                        isStreaming.value = false;
                        isThinking.value = false;
                        break;
                    }
                }
            }
        } catch (error) {
            console.error('Error streaming agent:', error);
        } finally {
            flushStreamToSpeech();

            loading.value = false;
            isStreaming.value = false;
            isThinking.value = false;

            if (suggestions.value.length > 0) {
                enableSuggestions.value = true;
            }
        }

        return streamOutput.value;
    }

    function handleStreamChunk(chunk: any) {
        const content = chunk?.content;
        const reasoning = chunk?.additional_kwargs?.reasoning_content;

        if (reasoning) {
            isThinking.value = true;
            thinkingOutput.value += reasoning;
        }

        if (!content) {
            return;
        }

        isThinking.value = false;
        thinkingOutput.value = '';

        streamOutput.value += content;

        if (isSuriVTube.value) {
            processSpeechChunk(content);
        }
    }

    function processSpeechChunk(content: string) {
        stackStreamOutput.value += content;

        const { sentences, remaining } = extractSentences(
            stackStreamOutput.value,
        );

        for (const sentence of sentences) {
            if (sentence.trim()) {
                speak(sentence);
            }
        }

        stackStreamOutput.value = remaining;
    }

    // Common abbreviations that should not terminate a sentence.
    const SENTENCE_ABBREVIATIONS = new Set([
        'e.g',
        'i.e',
        'etc',
        'vs',
        'dr',
        'mr',
        'mrs',
        'ms',
        'prof',
        'sr',
        'jr',
        'st',
        'approx',
        'fig',
        'no',
        'vol',
        'esp',
        'cf',
        'al',
    ]);

    /**
     * Splits the buffered text into complete sentences and returns the
     * unterminated tail so it is never lost while streaming.
     */
    function extractSentences(text: string): {
        sentences: string[];
        remaining: string;
    } {
        const sentences: string[] = [];
        let cursor = 0;

        // Match lazily up to a run of terminators (allowing closing
        // quotes/brackets right after), which must be followed by
        // whitespace or the end of the buffer.
        const re = /[\s\S]*?(?:[.!?…]+["'”’)\]]*)(?=\s|$)/g;

        let match: RegExpExecArray | null;
        while ((match = re.exec(text)) !== null) {
            if (match.index !== cursor) {
                break;
            }

            const raw = match[0];
            const trimmed = raw.trim();

            // Guard against abbreviations like "e.g. we" — if the token
            // right before the terminator is a known abbreviation and the
            // buffer continues, treat it as mid-sentence and keep scanning.
            const continues = re.lastIndex < text.length;
            if (continues && isAbbreviationEnding(trimmed)) {
                continue;
            }

            if (trimmed) {
                sentences.push(trimmed);
            }
            cursor = re.lastIndex;
        }

        return { sentences, remaining: text.slice(cursor) };
    }

    function isAbbreviationEnding(sentence: string): boolean {
        const lastWord = sentence
            // Strip trailing terminator + closing quotes/brackets.
            .replace(/(?:[.!?…]+["'”’)\]]*)$/, '')
            .split(/\s+/)
            .pop();

        if (!lastWord) {
            return false;
        }

        // Single letters like "A." or "J." are almost always initials.
        if (lastWord.length === 1 && /[a-zA-Zà-ỹÀ-Ỹ]/.test(lastWord)) {
            return true;
        }

        return SENTENCE_ABBREVIATIONS.has(lastWord.toLowerCase());
    }

    function flushStreamToSpeech() {
        if (!isSuriVTube.value) {
            return;
        }

        const text = stackStreamOutput.value.trim();

        if (!text) {
            return;
        }

        speak(text);
        stackStreamOutput.value = '';
    }

    watch(
        () => streamOutput.value,
        (newLang) => {
            if (!newLang) {
                return;
            }
            const avatarStore = useAvatarStore();
            avatarStore.say(newLang, 4000);
        },
    );

    watch(
        () => thinkingOutput.value,
        (newLang) => {
            const avatarStore = useAvatarStore();
            if (newLang) {
                avatarStore.think(newLang, 4000);
            }
        },
    );

    return {
        response,
        loading,
        isStreaming,
        streamOutput,
        isThinking,
        thinkingOutput,
        selectedLanguage,
        agentTone,
        agentResponseLength,
        agentResponseFormat,
        agentTechnicalLevel,
        agentProactivity,
        agentPersonality,
        enableSuggestions,
        suggestions,
        selectedAgent,
        invokeAgent,
        streamAgent,
    };
});
