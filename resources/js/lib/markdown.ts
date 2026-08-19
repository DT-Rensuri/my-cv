import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
    gfm: true,
    breaks: true,
});

/**
 * Render markdown string to sanitized HTML.
 *
 * `marked` works in both Node (SSR) and the browser, so markdown is always
 * rendered consistently — this avoids layout/hydration mismatches on refresh.
 * DOMPurify (which needs a DOM) is only applied on the client.
 */
export function renderMarkdown(text: string): string {
    const raw = marked.parse(text, { async: false }) as string;

    if (typeof window !== 'undefined' && DOMPurify) {
        return DOMPurify.sanitize(raw);
    }

    // SSR / no DOM: DOMPurify is unavailable, so strip dangerous tags manually.
    return raw
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/<object[\s\S]*?<\/object>/gi, '')
        .replace(/<embed[\s\S]*?<\/embed>/gi, '')
        .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}
