
import { useStageSettingStore } from '@/stores/stageSettings';

export function useLipSync() {
    let mouthRafId: number | null = null;
    const settingsStore = useStageSettingStore();

    function speech() {
        if (mouthRafId !== null) return;
        settingsStore.nowSpeaking = true;

        const animate = () => {
            const t = performance.now() / 1000;
            // Layered sines so the mouth motion feels less mechanical.
            settingsStore.mouthOpenSize =
                (Math.sin(t * 11) * 0.5 + Math.sin(t * 23) * 0.3 + 0.2) * 70;

            mouthRafId = requestAnimationFrame(animate);
        };

        mouthRafId = requestAnimationFrame(animate);
    }

    function stopLipSync() {
        if (mouthRafId !== null) {
            cancelAnimationFrame(mouthRafId);
            mouthRafId = null;
        }

        settingsStore.mouthOpenSize = 0;
        settingsStore.nowSpeaking = false;
    }

    return {
        speech,
        stopLipSync
    };
}
