/**
 * Central registry of avatar emotes → local webp assets + metadata.
 *
 * This is the SINGLE source of truth for the floating guide avatar's
 * expressions. To add a new emote, just add one line here:
 *
 *   myEmote: { name: '...', description: '...', el: '...' },
 *
 * The type `AvatarEmote`, the `EMOTES` array (used by the AI tool schema)
 * and the `EMOTE_GIFS` map (used by the UI) are all derived from this object,
 * so everything stays in sync automatically.
 */

// Eagerly import every local emoji asset so Vite bundles & hashes them.
const emojiAssets = import.meta.glob('../../emoji/*.webp', {
    eager: true,
    import: 'default',
    query: '?url',
}) as Record<string, string>;

/** Resolves a local emoji file to its bundled URL. */
const emoji = (file: string): string => emojiAssets[`../../emoji/${file}`];

export const EMOTE_GIFS = {
    // --- Core emotes (used by the guide logic) ---
    idle: {
        name: 'idle',
        description: 'Khuôn mặt nghỉ ngơi bình thường (mặc định).',
        el: emoji('idle.webp'),
    },
    wave: {
        name: 'wave',
        description: 'Vẫy tay chào hỏi hoặc tạm biệt.',
        el: emoji('wave.webp'),
    },
    happy: {
        name: 'happy',
        description: 'Vui vẻ, chào hỏi, tin tốt.',
        el: emoji('happy.webp'),
    },
    think: {
        name: 'think',
        description: 'Đang suy nghĩ, cân nhắc câu hỏi.',
        el: emoji('think.webp'),
    },
    point: {
        name: 'point',
        description: 'Chỉ vào một phần hoặc chi tiết nào đó.',
        el: emoji('point.webp'),
    },
    celebrate: {
        name: 'celebrate',
        description: 'Ăn mừng thành công, thành tích, tin tuyệt vời.',
        el: emoji('celebrate.webp'),
    },

    // --- Extended emotes (from Emoji.txt) ---
    cool: {
        name: 'cool',
        description: 'Ngầu, tự tin, phong cách.',
        el: emoji('cool.webp'),
    },
    refuse: {
        name: 'refuse',
        description: 'Từ chối một cách lịch sự.',
        el: emoji('refuse.webp'),
    },
    craving: {
        name: 'craving',
        description: 'Thèm khát, khao khát điều gì đó.',
        el: emoji('craving.webp'),
    },
    superAngry: {
        name: 'superAngry',
        description: 'Siêu tức giận.',
        el: emoji('superAngry.webp'),
    },
    rich: {
        name: 'rich',
        description: 'Đại gia, giàu có.',
        el: emoji('rich.webp'),
    },
    dozing: {
        name: 'dozing',
        description: 'Ngủ gật, buồn ngủ.',
        el: emoji('dozing.webp'),
    },
    love: {
        name: 'love',
        description: 'Yêu quá, trìu mến.',
        el: emoji('love.webp'),
    },
    heartbroken: {
        name: 'heartbroken',
        description: 'Thất tình, buồn bã.',
        el: emoji('heartbroken.webp'),
    },
    dazed: {
        name: 'dazed',
        description: 'Ngơ ngác, bối rối.',
        el: emoji('dazed.webp'),
    },
    noListen: {
        name: 'noListen',
        description: 'Không muốn nghe.',
        el: emoji('noListen.webp'),
    },
    worried: {
        name: 'worried',
        description: 'Lo lắng.',
        el: emoji('worried.webp'),
    },
    workStress: {
        name: 'workStress',
        description: 'Căng thẳng vì công việc.',
        el: emoji('workStress.webp'),
    },
    tongue: {
        name: 'tongue',
        description: 'Lêu lêu, trêu chọc.',
        el: emoji('tongue.webp'),
    },
    surprised: {
        name: 'surprised',
        description: 'Ngạc nhiên.',
        el: emoji('supprised.webp'),
    },
    silly: {
        name: 'silly',
        description: 'Ngốc nghếch, khờ khạo.',
        el: emoji('silly.webp'),
    },
    sulky: { name: 'sulky', description: 'Dỗi, hờn.', el: emoji('sulky.webp') },
    angry: { name: 'angry', description: 'Tức giận.', el: emoji('angry.webp') },
    exploited: {
        name: 'exploited',
        description: 'Bị bóc lột, làm việc quá sức.',
        el: emoji('exploited.webp'),
    },
    crying: {
        name: 'crying',
        description: 'Khóc, buồn.',
        el: emoji('crying.webp'),
    },
    lazy: { name: 'lazy', description: 'Lười biếng.', el: emoji('lazy.webp') },
    serious: {
        name: 'serious',
        description: 'Nghiêm nghị, nghiêm túc.',
        el: emoji('serious.webp'),
    },
    hungry: { name: 'hungry', description: 'Đói.', el: emoji('hungry.webp') },
    scared: {
        name: 'scared',
        description: 'Hoảng sợ.',
        el: emoji('scared.webp'),
    },
    heart2: {
        name: 'heart2',
        description: 'Thả tim, thích.',
        el: emoji('heart2.webp'),
    },
    lag: {
        name: 'lag',
        description: 'Bị lag, đang xử lý.',
        el: emoji('lag.webp'),
    },
    doubt: { name: 'doubt', description: 'Nghi ngờ.', el: emoji('doubt.webp') },
    holdLaugh: {
        name: 'holdLaugh',
        description: 'Nhịn cười.',
        el: emoji('holdLaugh.webp'),
    },
    panicked: {
        name: 'panicked',
        description: 'Hốt hoảng.',
        el: emoji('panicked.webp'),
    },
    like2: {
        name: 'like2',
        description: 'Like, thích.',
        el: emoji('like2.webp'),
    },
    sleepy: {
        name: 'sleepy',
        description: 'Buồn ngủ.',
        el: emoji('sleepy.webp'),
    },
    naive: {
        name: 'naive',
        description: 'Khờ khạo, ngây thơ.',
        el: emoji('naive.webp'),
    },
    slamTable: {
        name: 'slamTable',
        description: 'Đập bàn, tức giận.',
        el: emoji('slamTable.webp'),
    },
    ok: { name: 'ok', description: 'Đồng ý, ok.', el: emoji('ok.webp') },
} as const;

/** Union type of every available emote key. */
export type AvatarEmote = keyof typeof EMOTE_GIFS;

/** Array of all emote keys (used to build the AI tool's enum schema). */
export const EMOTES = Object.keys(EMOTE_GIFS) as AvatarEmote[];