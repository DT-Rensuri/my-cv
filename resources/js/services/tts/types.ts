import type { TtsJobOptions } from '@/types/tts';

export type { TtsJobOptions };

export interface TtsJob {
    id: number;
    text: string;
    audio?: Blob;
}

export interface TtsLipSync {
    startLipSync: (mouthOpenSize: number) => void;
    stopLipSync: () => void;
}

export interface TtsQueueHooks {
    onJobStart?: (job: TtsJob) => void;
    onJobEnd?: (job: TtsJob) => void;
    onError?: (error: unknown, job: TtsJob | undefined) => void;
}

export type TtsJobListener = (job: TtsJob) => void;
export type TtsErrorListener = (error: unknown, job: TtsJob | undefined) => void;
