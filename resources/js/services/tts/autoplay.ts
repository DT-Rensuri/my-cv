const UNLOCK_EVENTS = [
    'pointerdown',
    'keydown',
    'touchstart',
] as const;

export function isAutoplayBlock(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'NotAllowedError';
}

/**
 * Waits for a first user gesture (pointerdown / keydown / touchstart)
 * to unlock audio autoplay, then invokes the callback once.
 */
export function waitForUserGesture(onUnlock: () => void): void {
    const onGesture = () => {
        UNLOCK_EVENTS.forEach((event) => {
            window.removeEventListener(event, onGesture);
        });

        onUnlock();
    };

    UNLOCK_EVENTS.forEach((event) => {
        window.addEventListener(event, onGesture, {
            once: true,
            passive: true,
        });
    });
}
