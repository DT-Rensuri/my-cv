import { useExpressionStore } from '@dtrensuri/stage-ui-live2d';
import type {
    ExpressionGroupDefinition,
    ExpressionEntry,
} from '@dtrensuri/stage-ui-live2d/stores/expression-store';
import { createPinia } from 'pinia';

export function useMotionSync() {
    const pinia = createPinia();
    const expressionStore = useExpressionStore(pinia);
    const expressionGroup: ExpressionGroupDefinition[] = [
        {
            name: 'happy',
            parameters: [{ parameterId: 'ParamHappy', blend: 'Add', value: 1 }],
        },
    ];
    const expressionEntries: ExpressionEntry[] = [
        {
            name: 'ParamHappy',
            parameterId: 'ParamHappy',
            blend: 'Add',
            currentValue: 0,
            defaultValue: 0,
            modelDefault: 0,
            targetValue: 1,
        },
    ];

    expressionStore.registerExpressions(
        'model-a',
        expressionGroup,
        expressionEntries,
    );

    return {
        expressionStore,
    };
}
