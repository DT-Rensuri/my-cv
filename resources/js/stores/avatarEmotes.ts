/**
 * Central registry of avatar emotes → GIF URLs.
 *
 * This is the SINGLE source of truth for the floating guide avatar's
 * expressions. To add a new emote, just add one line here:
 *
 *   myEmote: 'https://media.giphy.com/media/XXXX/giphy.gif',
 *
 * The type `AvatarEmote`, the `EMOTES` array (used by the AI tool schema)
 * and the `EMOTE_GIFS` map (used by the UI) are all derived from this object,
 * so everything stays in sync automatically.
 */
export const EMOTE_GIFS = {
  // --- Core emotes (used by the guide logic) ---
  idle: 'https://media.giphy.com/media/uBn5A3rxwD7N8nZvlw/giphy.gif', // idle
  wave: 'https://media.giphy.com/media/1hoKkBNSBxVyHIsPer/giphy.gif', // thả tim
  happy: 'https://media.giphy.com/media/pbKSEFrEEudOIclaL8/giphy.gif', // vui vẻ
  think: 'https://media.giphy.com/media/XWj51fkipHFMUNP8xB/giphy.gif', // loading
  point: 'https://media.giphy.com/media/QYjC3IJxPGNnhget13/giphy.gif', // like
  celebrate: 'https://media.giphy.com/media/h20IwOYYJgCMbj4uaD/giphy.gif', // phởn

  // --- Extended emotes (from Emoji.txt) ---
  cool: 'https://media.giphy.com/media/5eFtKFqu5D34WNno9u/giphy.gif', // Cool ngầu
  refuse: 'https://media.giphy.com/media/oy9hVQl8Hq7o8T3tER/giphy.gif', // Hết lòng từ chối
  craving: 'https://media.giphy.com/media/WNlsQiGMU387hn7UZQ/giphy.gif', // Thèm khát
  superAngry: 'https://media.giphy.com/media/65Th0K9yQJtKcxeYyN/giphy.gif', // Siêu tức giận
  rich: 'https://media.giphy.com/media/2mzRDsekJ4VqZIa2Cd/giphy.gif', // Đại gia
  dozing: 'https://media.giphy.com/media/XoM1eSwGMXK4huqV2E/giphy.gif', // Ngủ gật
  love: 'https://media.giphy.com/media/1hMjSIv1JBPEdoz73Y/giphy.gif', // yêu quá
  heartbroken: 'https://media.giphy.com/media/45314GJC3sIVJWP0S1/giphy.gif', // thất tình
  heart: 'https://media.giphy.com/media/1hoKkBNSBxVyHIsPer/giphy.gif', // thả tim
  dazed: 'https://media.giphy.com/media/5jYcUPGBGgUioiBq4r/giphy.gif', // Ngơ ngác
  noListen: 'https://media.giphy.com/media/1ynDNZYeUwPkQBhx99/giphy.gif', // Không muốn nghe
  worried: 'https://media.giphy.com/media/WxKdPPaxNLCdxgLoBN/giphy.gif', // lo lắng
  workStress: 'https://media.giphy.com/media/9PwWklO9tSELtIhBka/giphy.gif', // Stress vì công việc
  tongue: 'https://media.giphy.com/media/Q66dCIgxnb4uzEYDqS/giphy.gif', // lêu lêu
  surprised: 'https://media.giphy.com/media/h5WUsjFmE6329tkcAz/giphy.gif', // ngạc nhiên
  elated: 'https://media.giphy.com/media/h20IwOYYJgCMbj4uaD/giphy.gif', // Phởn
  silly: 'https://media.giphy.com/media/jTAkn6hKyy2esWjOOZ/giphy.gif', // Ngốc nghếch
  sulky: 'https://media.giphy.com/media/KdB5DnYdadrJMWP6Rz/giphy.gif', // Dỗi
  like: 'https://media.giphy.com/media/QYjC3IJxPGNnhget13/giphy.gif', // Like
  angry: 'https://media.giphy.com/media/MFkTITj69pMOPlbfeX/giphy.gif', // Tức giận
  exploited: 'https://media.giphy.com/media/j9eToXPhhR2Mh4ZMLg/giphy.gif', // Bị bóc lột
  crying: 'https://media.giphy.com/media/QlQdLBS70XJcZY1fLF/giphy.gif', // khóc
  lazy: 'https://media.giphy.com/media/Pkuzzo4rVMXW558Uka/giphy.gif', // Lười biếng
  serious: 'https://media.giphy.com/media/OgmbF5ibV01vflyU2n/giphy.gif', // Nghiêm nghị
  hungry: 'https://media.giphy.com/media/EExJM3NifsBwjJukuF/giphy.gif', // đói
  scared: 'https://media.giphy.com/media/MQGNf0r6Xagrw5KfVL/giphy.gif', // hoảng sợ
  heart2: 'https://media.giphy.com/media/IEm8kcqLVCctHJ1kWm/giphy.gif', // Thả tim
  lag: 'https://media.giphy.com/media/6IEIFOBIb1Y2f2mcnO/giphy.gif', // Bị lag
  doubt: 'https://media.giphy.com/media/2weSkZg9hvQW5Zv2fk/giphy.gif', // Nghi ngờ
  holdLaugh: 'https://media.giphy.com/media/XaYigEghuWAyS3HOoA/giphy.gif', // Nhịn cười
  panicked: 'https://media.giphy.com/media/FF5i6JkK5BE83PU9K1/giphy.gif', // hốt hoảng
  loading: 'https://media.giphy.com/media/XWj51fkipHFMUNP8xB/giphy.gif', // loading
  like2: 'https://media.giphy.com/media/qGmLWDPFAzOAz8DU2L/giphy.gif', // like nè
  sleepy: 'https://media.giphy.com/media/eH1hKMxY7ZzhJiML2C/giphy.gif', // buồn ngủ
  naive: 'https://media.giphy.com/media/yPAWyc35MhDUNrzySi/giphy.gif', // khờ khạo
  slamTable: 'https://media.giphy.com/media/Z3Op6V4KdP7ZQWft5O/giphy.gif', // đập bàn
  ok: 'https://media.giphy.com/media/4i5XhA2un9XG4lqSxC/giphy.gif', // ok
} as const;

/** Union type of every available emote key. */
export type AvatarEmote = keyof typeof EMOTE_GIFS;

/** Array of all emote keys (used to build the AI tool's enum schema). */
export const EMOTES = Object.keys(EMOTE_GIFS) as AvatarEmote[];