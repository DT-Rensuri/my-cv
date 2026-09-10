export interface TtsFilterOptions {
    removeEmoji?: boolean;
    removeMarkdown?: boolean;
    removeUrls?: boolean;
    removeCode?: boolean;
    removeSpecialChars?: boolean;
    normalizeNumbers?: boolean;
    normalizePunctuation?: boolean;
    maxLength?: number;
    normalizeTime?: boolean;
}

export class TtsTextFilter {
    private readonly options: Required<TtsFilterOptions>;

    constructor(options: TtsFilterOptions = {}) {
        this.options = {
            removeEmoji: true,
            removeMarkdown: true,
            removeUrls: true,
            removeCode: true,
            removeSpecialChars: true,
            normalizeNumbers: true,
            normalizePunctuation: true,
            maxLength: 5000,
            normalizeTime: true,
            ...options,
        };
    }

    clean(input: string): string {
        if (!input) return '';

        let text = input;

        // --------------------------------------------------
        // 1. Normalize Unicode
        // --------------------------------------------------
        text = text.normalize('NFKC');

        // --------------------------------------------------
        // 2. Preserve TTS emotion tags
        //
        // Examples:
        // [laugh]
        // [sigh]
        // [excited]
        // [happy]
        // [sad]
        // [angry]
        // [thinking]
        //
        // Only preserve simple tags:
        // [a-zA-Z0-9_-]
        //
        // This prevents normal Markdown / special-char
        // filtering from destroying the tags.
        // --------------------------------------------------
        const ttsTags: string[] = [];

        text = text.replace(/\[[\p{L}\p{N}_-]+\]/gu, (tag) => {
            const index = ttsTags.length;

            ttsTags.push(tag);

            return `TTSTAG${index}`;
        });

        // --------------------------------------------------
        // 3. Remove HTML
        // --------------------------------------------------
        text = text.replace(/<[^>]*>/g, ' ');

        // --------------------------------------------------
        // 4. Remove code blocks
        // --------------------------------------------------
        if (this.options.removeCode) {
            // Fenced code
            text = text.replace(/```[\s\S]*?```/g, ' ');

            // Inline code
            text = text.replace(/`[^`]*`/g, ' ');
        }

        // --------------------------------------------------
        // 5. Remove URLs
        // --------------------------------------------------
        if (this.options.removeUrls) {
            text = text.replace(/(?:https?:\/\/|www\.)[^\s]+/gi, ' ');
        }

        // --------------------------------------------------
        // 6. Remove Markdown
        // --------------------------------------------------
        if (this.options.removeMarkdown) {
            // Headings
            text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');

            // Bold
            text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');

            // Italic
            text = text.replace(/(\*|_)(.*?)\1/g, '$2');

            // Markdown links
            //
            // [Google](https://google.com)
            // -> Google
            //
            // TTS tags have already been replaced
            // with placeholders.
            text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

            // Blockquote
            text = text.replace(/^\s*>\s?/gm, '');

            // Unordered list
            text = text.replace(/^\s*[-*+]\s+/gm, '');

            // Ordered list
            text = text.replace(/^\s*\d+[.)]\s+/gm, '');
        }

        // --------------------------------------------------
        // 7. Remove emoji / pictographs
        // --------------------------------------------------
        if (this.options.removeEmoji) {
            text = text.replace(
                /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
                '',
            );
        }

        // --------------------------------------------------
        // 8. Remove special symbols
        // --------------------------------------------------
        if (this.options.removeSpecialChars) {
            text = text
                // Arrows
                .replace(/[→←↑↓↔↕⇒⇐⇑⇓]/g, ' ')

                // Mathematical symbols
                .replace(/[±×÷≈≠≤≥∞√∑∏∫]/g, ' ')

                // Decorative symbols
                .replace(/[★☆◆◇■□●○♦♣♠♥]/g, ' ')

                // Separators
                .replace(/[|¦~^]+/g, ' ')

                // Brackets
                //
                // [] are intentionally NOT removed
                // because TTS tags are protected.
                .replace(/[(){}<>]/g, ' ');
        }

        // --------------------------------------------------
        // 9. Normalize punctuation
        // --------------------------------------------------
        if (this.options.normalizePunctuation) {
            text = text
                // Repeated !
                .replace(/!{2,}/g, '!')

                // Repeated ?
                .replace(/\?{2,}/g, '?')

                // Excessive dots
                .replace(/\.{4,}/g, '...')

                // Colon
                .replace(/\s*:\s*/g, ': ')

                // Semicolon
                .replace(/\s*;\s*/g, '; ')

                // Comma
                .replace(/\s*,\s*/g, ', ')

                // Period
                .replace(/\s*\.\s*/g, '. ');
        }

        // --------------------------------------------------
        // 10. Normalize numbers
        // --------------------------------------------------
        if (this.options.normalizeNumbers) {
            text = this.normalizeNumbers(text);
        }

        // --------------------------------------------------
        // 11. Remove unsupported characters
        //
        // Keep:
        // - Unicode letters
        // - combining marks
        // - numbers
        // - whitespace
        // - basic punctuation
        //
        // The TTS tags are currently represented by:
        //
        // __TTS_TAG_0__
        //
        // so we don't need [] here.
        // --------------------------------------------------
        if (this.options.removeSpecialChars) {
            text = text.replace(/[^\p{L}\p{M}\p{N}\s.,!?;:'"%+\-=/]/gu, ' ');
        }

        // --------------------------------------------------
        // 12. Clean whitespace
        // --------------------------------------------------
        text = text.replace(/\s+/g, ' ').trim();

        // --------------------------------------------------
        // 13. Limit length
        // --------------------------------------------------
        if (this.options.maxLength > 0) {
            text = text.slice(0, this.options.maxLength);
        }

        // --------------------------------------------------
        // 14. Normalize time
        // --------------------------------------------------
        if (this.options.normalizeTime) {
            text = this.normalizeTime(text);
        }

        // --------------------------------------------------
        // 15. Restore TTS tags
        // --------------------------------------------------
        text = text.replace(/TTSTAG(\d+)/g, (_match, index: string) => {
            return ttsTags[Number(index)] ?? '';
        });

        // --------------------------------------------------
        // 16. Final whitespace cleanup
        // --------------------------------------------------
        text = text.replace(/\s+/g, ' ').trim();

        return text;
    }

    // ------------------------------------------------------
    // Normalize numbers
    // ------------------------------------------------------
    private normalizeNumbers(text: string): string {
        return (
            text
                // 50%
                // -> 50 phần trăm
                .replace(/(\d+)%/g, '$1 phần trăm')

                // 25°C
                // -> 25 độ C
                .replace(/(\d+(?:[.,]\d+)?)\s*°C/gi, '$1 độ C')

                // 80°F
                // -> 80 độ F
                .replace(/(\d+(?:[.,]\d+)?)\s*°F/gi, '$1 độ F')
        );
    }

    // ------------------------------------------------------
    // Normalize time
    // ------------------------------------------------------
    private normalizeTime(text: string): string {
        return text.replace(
            /\b(\d{1,2}):(\d{2})\b/g,
            (_match, hours: string, minutes: string) => {
                const h = parseInt(hours, 10);
                const m = parseInt(minutes, 10);

                let result = '';

                if (h > 0) {
                    result += `${h} giờ`;
                }

                if (m > 0) {
                    if (result) {
                        result += ' ';
                    }

                    result += `${m} phút`;
                }

                return result || '0 phút';
            },
        );
    }
}
