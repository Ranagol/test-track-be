// stores/useTestEditorStore.ts
import { defineStore } from 'pinia';
import type { Test } from '@/types/types';
import { testActions } from './testEditor/testActions';
import { questionActions } from './testEditor/questionActions';
import { answerOptionActions } from './testEditor/answerOptionActions';

export const useTestEditorStore = defineStore('testEditor', {

    state: () => ({
        test: null as Test | null,
        loading: false,
    }),

    actions: {
        ...testActions,
        ...questionActions,
        ...answerOptionActions,
    },
});
