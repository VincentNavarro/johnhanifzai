export const SOUND_URLS = [
  '/sounds/click_sound_1.m4a',
  '/sounds/click_sound_2.m4a',
  '/sounds/click_sound_3.m4a',
  '/sounds/click_sound_4.m4a',
]

export function pickRandomSound(urls: string[], random: () => number = Math.random): string {
  return urls[Math.floor(random() * urls.length)]
}
