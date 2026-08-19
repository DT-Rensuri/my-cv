import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { agent } from '@/services/langchain';
import { LanguageOption } from '@/types/chat';
import { useAvatarStore } from './avatar';

export type AgentMessage = { role: string; content: string };

export const useAgentStore = defineStore('agent', () => {
    const response = ref<string | null>(null);
    const loading = ref(false);
    const enableSuggestions = ref(true);
    const suggestions = ref<string[]>([]);
    const selectedAgent = ref('default');

    const streamOutput = ref<string>('');
    const thinkingOutput = ref<string>('');
    const isStreaming = ref(false);
    const isThinking = ref(false);
    const selectedLanguage = ref<LanguageOption>( { code: 'vi', name: 'Vietnamese' });
    const agentTone = ref<string>('friendly');
    const agentResponseLength = ref<string>('balanced');
    const agentResponseFormat = ref<string>('plain_text');
    const agentTechnicalLevel = ref<string>('adaptive');
    const agentProactivity = ref<string>('normal');
    const agentPersonality = ref<string>('I am a helpful and friendly assistant.');

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
            case 'default':
                return agent;
            default:
                return agent;
        }
    }

    async function invokeAgent(message: AgentMessage): Promise<string | null> {
        loading.value = true;
        response.value = null;
        const agentInstance = getAgentInstance();
        try {
            const result = await agentInstance.invoke(
                { messages: [message] },
                { configurable: { thread_id: 'default' } },
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
        try {
            resetStream();
            loading.value = true;
            const agentInstance = getAgentInstance();
            const stream = await agentInstance.streamEvents(
                { messages: [message] },
                { configurable: { thread_id: 'default' } },
            );

            for await (const event of stream) {
                if (event.event === 'on_chat_model_start') {
                    loading.value = true;
                    isStreaming.value = true;
                }

                if (event.event === 'on_chat_model_stream') {
                    const chunk = event.data?.chunk;
                    const content = chunk?.content;
                    const reasoning =
                        chunk?.additional_kwargs?.reasoning_content;

                    if (reasoning) {
                        isThinking.value = true;
                        thinkingOutput.value += reasoning;
                    }

                    if (content) {
                        isThinking.value = false;
                        thinkingOutput.value = '';
                        streamOutput.value += content;
                    }
                }

                if (event.event === 'on_chat_model_end') {
                    loading.value = false;
                    isStreaming.value = false;
                    isThinking.value = false;
                    if (suggestions.value.length > 0) {
                        enableSuggestions.value = true;
                    }
                }
            }
        } catch (error) {
            console.error('Error streaming agent:', error);
        } finally {
            loading.value = false;
            isStreaming.value = false;
            isThinking.value = false;

            return streamOutput.value;
        }
    }

    watch(
        () => streamOutput.value,
        (newLang) => {
            const avatarStore = useAvatarStore();
            if (newLang) {
                avatarStore.say(newLang, 4000);
            }
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
        invokeAgent,
        streamAgent,
    };
});
