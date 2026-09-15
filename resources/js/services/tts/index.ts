export { TtsQueue } from './tts-queue';
export { AudioPlayer } from './audio-player';
export { isAutoplayBlock, waitForUserGesture } from './autoplay';
export { TtsWorkerClient } from './tts-worker-client';
export type {
    TtsWorkerRequest,
    TtsWorkerResponse,
    TtsWorkerResult,
    TtsWorkerError,
} from './tts-worker';
export type {
    TtsJob,
    TtsJobOptions,
    TtsLipSync,
    TtsQueueHooks,
    TtsJobListener,
    TtsErrorListener,
} from './types';

