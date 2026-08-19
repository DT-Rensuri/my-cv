/**
 * Shared DOM helpers for the guide-tour agent tools.
 *
 * These utilities scroll to sections, resolve section ids, and apply
 * temporary "spotlight" highlights without mutating permanent DOM state.
 */

/** The main navigation / content sections of the one-page portfolio. */
export const SECTION_IDS = [
  'top',
  'about',
  'education',
  'experience',
  'skills',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  top: 'Hero / Trang chủ',
  about: 'Giới thiệu / Mục tiêu nghề nghiệp',
  education: 'Học vấn',
  experience: 'Kinh nghiệm làm việc',
  skills: 'Kỹ năng',
  contact: 'Liên hệ',
};

/** Normalize a user-supplied section key to a valid known section id. */
export function resolveSectionId(raw?: string): SectionId | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase().replace(/^#/, '');
  const found = SECTION_IDS.find((id) => id === key);
  if (found) return found;

  // Fuzzy match by label keyword.
  const labelKey = key.toLowerCase();
  const map: Array<[RegExp, SectionId]> = [
    [/hero|trang chủ|home|top|start|bđầu|begin/, 'top'],
    [/giới thiệu|mục tiêu|about|objective|target/, 'about'],
    [/học vấn|education|trường|trư.ng|học/, 'education'],
    [/kinh nghiệm|k.nghiệm|experience|work|exp|việc/, 'experience'],
    [/kỹ năng|ki nang|k.năng|skill/, 'skills'],
    [/liên hệ|li. hệ|contact|email|phone/, 'contact'],
  ];
  for (const [re, id] of map) {
    if (re.test(labelKey)) return id;
  }
  return null;
}

/** Smoothly scroll a known section into view. Returns false if missing. */
export function scrollToSection(id: SectionId): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const target =
    id === 'top'
      ? 0
      : el.getBoundingClientRect().top + window.scrollY - 72; // navbar offset
  window.scrollTo({ top: target, behavior: 'smooth' });
  return true;
}

const HIGHLIGHT_CLASS = 'agent-spotlight';

/** Apply a temporary CSS-class highlight to a section, auto-removing after ms. */
export function spotlightSection(id: SectionId, ms = 2200): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const prev = el.style.outline;
  const prevColor = el.style.outlineColor;
  const prevBg = el.style.background;
  el.classList.add(HIGHLIGHT_CLASS);
  el.style.outline = '3px solid var(--color-accent, #00e7b0)';
  el.style.outlineOffset = '-3px';
  el.style.background = 'rgba(0, 231, 176, 0.06)';
  window.setTimeout(() => {
    el.classList.remove(HIGHLIGHT_CLASS);
    el.style.outline = prev;
    el.style.outlineColor = prevColor;
    el.style.background = prevBg;
  }, Math.max(0, ms));
  return true;
}

/** Scroll to a card/canvas element by a stable text fragment. */
export function scrollToText(text: string): boolean {
  const needle = text.trim().toLowerCase();
  if (!needle) return false;
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
  );
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.textContent?.trim().toLowerCase().includes(needle)) {
      const parent = node.parentElement;
      if (!parent) return false;
      window.scrollTo({
        top: parent.getBoundingClientRect().top + window.scrollY - 90,
        behavior: 'smooth',
      });
      return true;
    }
  }
  return false;
}