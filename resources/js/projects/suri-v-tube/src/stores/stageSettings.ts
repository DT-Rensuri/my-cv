import { defineStore, storeToRefs } from 'pinia';
import { refManualReset } from '@vueuse/core';
import { useLocalStorageManualReset } from '@dtrensuri/stage-shared/composables';
import { ref, computed } from 'vue';

export const DEFAULT_THEME_COLORS_HUE = 220.44;
export type StageModelRenderer =
    | 'live2d'
    | 'vrm'
    | 'spine'
    | 'tachie'
    | 'mmd'
    | 'godot'
    | 'disabled'
    | undefined;

const useStageModelSelectionStore = defineStore(
    'settings-stage-model-selection',
    () => {
        // Pinia synchronization owns live cross-window state. localStorage only
        // loads and saves the durable model selection.
        const selected = useLocalStorageManualReset<string>(
            'settings/stage/model',
            'preset-live2d-1',
            {
                listenToStorageChanges: false,
            },
        );

        function resetState() {
            selected.reset();
        }

        return {
            selected,
            resetState,
        };
    }
);

export const useStageSettingStore = defineStore('stageSetting', () => {
    const stageModelSelectionStore = useStageModelSelectionStore();

    const stageModelRenderer = refManualReset<StageModelRenderer>(undefined);
    const stageModelSelectedUrl = refManualReset<string | undefined>('/assets/live2d/models/hiyori_pro_zh.zip');
    const { selected: stageModelSelectedState } = storeToRefs(
        stageModelSelectionStore,
    );
    const mouthOpenSize = ref(0);
    const nowSpeaking = ref(false);

    const stageModelSelected = computed<string>({
        get: () => stageModelSelectedState.value,
        set: (value) => {
            stageModelSelectedState.value = value;
        },
    });
    const themeColorsHue = useLocalStorageManualReset<number>(
        'settings/theme/colors/hue',
        DEFAULT_THEME_COLORS_HUE,
    );
    const themeColorsHueDynamic = useLocalStorageManualReset<boolean>(
        'settings/theme/colors/hue-dynamic',
        false,
    );

    return {
        stageModelRenderer,
        stageModelSelectedUrl,
        stageModelSelected,
        themeColorsHue,
        themeColorsHueDynamic,
        mouthOpenSize,
        nowSpeaking,
    };
});
