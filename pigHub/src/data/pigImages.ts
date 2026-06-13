import type { PigImage } from '../types/types'

const baseUrl = '/data/'

export const pigImages: PigImage[] = [
  ['猪籽军舰', '猪籽军舰.jpeg', 109033, 5245],
  ['吃了就睡睡了就吃', '吃了就睡睡了就吃.png', 106214, 4738],
  ['猪坐飞机', '猪坐飞机.png', 106322, 1775],
  ['猪钓猪', '猪钓猪.jpg', 107865, 1911],
  ['猪反转', '猪反转.jpg', 110132, 1515],
  ['猪的世界一直下雨', '猪的世界一直下雨.png', 110833, 2408],
  ['猪画画', '猪画画.webp', 111666, 439],
  ['猪过情人节', '猪过情人节.png', 112619, 750],
  ['猪冲榜（PJSK）', '猪冲榜（PJSK）.jpg', 113331, 1007],
  ['猪约会', '猪约会.jpg', 115092, 1045],
  ['猪下床', '猪下床.jpg', 112765, 2392],
  ['猪奶', '猪奶.jpg', 113092, 1946],
  ['！？', '！？.jpg', 145383, 5359],
  ['猪突猛进', '猪突猛进.jpg', 7790, 167],
  ['？！', '？！.jpg', 151500, 1385],
  ['+1猪', '+1猪.jpg', 153605, 3236],
].map(([title, fileName, views, downloads], index) => ({
  id: 2161 - index,
  title: String(title),
  file: `${baseUrl}${fileName}`,
  views: Number(views),
  downloads: Number(downloads),
  createdAt: Date.now() - index * 86_400_000,
}))
