import { computed, onBeforeUnmount, ref } from 'vue';
import { TtsQueue } from '@/services/tts';
import { guestApi } from '@/services/api/guest';
import { useLipSync } from './live2d/lipSync';
import { useMotionSync } from './live2d/motionSync';

export interface TtsVoice {
    id: string;
    name: string;
}

export type TtsPlaybackState = 'idle' | 'fetching' | 'playing';

async function getTtsVoices(): Promise<TtsVoice[]> {
    const response = await guestApi.get<TtsVoice[]>('tts/voices');
    return response.data ?? [];
}

export function useSpeech() {
    const motionSync = useMotionSync();
    const lipSync = useLipSync();
    const playbackState = ref<TtsPlaybackState>('idle');
    const voices = ref<TtsVoice[]>([]);
    const selectedVoice = ref<string | undefined>(undefined);
    const isSpeaking = computed(() => playbackState.value !== 'idle');


    const queue = new TtsQueue(
        undefined,
        () => {
            playbackState.value = 'playing';
        },
        () => {
            if (queue.length === 0) {
                playbackState.value = 'idle';
            }
        },
        () => {
            playbackState.value = 'idle';
        },
        {
            startLipSync: lipSync.startLipSync,
            stopLipSync: lipSync.stopLipSync,
        }
    );

    async function loadVoices() {
        voices.value = await getTtsVoices();
    }

    function speak(text: string, voice = selectedVoice.value) {
        if (!text.trim()) return;

        playbackState.value = 'fetching';
        queue.add(text, voice ? { voice } : {});
    }

    function stopSpeech() {
        queue.stop();
        lipSync.stopLipSync();
        playbackState.value = 'idle';
    }

    onBeforeUnmount(stopSpeech);

    return {
        queue,
        playbackState,
        isSpeaking,
        voices,
        selectedVoice,
        loadVoices,
        speak,
        stopSpeech,
    };
}
