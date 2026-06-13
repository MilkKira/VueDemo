# PigHub Vue 复刻实现文档

## 1. 实现目标

本项目使用 Vue 3、TypeScript、Vue Router 和 Vite 复刻 PigHub 的主要视觉与交互：

- 黑色背景、橙色强调色、吸顶导航和三段式页脚。
- 精选猪猪、全部猪猪、添加猪猪三个页面。
- 四列、三列、两列响应式图片网格。
- 搜索、最新/最热/随机排序、按名称/时间排序和加载更多。
- 卡片悬浮、查看量、下载量、下载按钮和复制图片地址提示。
- 文件点击选择、拖拽选择、图片预览、大小/格式校验和模拟上传进度。

本复刻不连接原站写接口。图片使用原站公开资源地址，上传只在浏览器本地模拟，避免学习项目向真实站点提交内容。

## 2. 技术结构

```text
src/
├─ components/
│  ├─ pigHeader.vue       # Logo、搜索框、导航
│  ├─ PigFooter.vue       # 页脚
│  └─ PigCard.vue         # 图库卡片
├─ composables/
│  └─ usePigSearch.ts     # 跨页面共享搜索词
├─ data/
│  └─ pigImages.ts        # 学习版静态图库数据
├─ views/
│  ├─ HomeView.vue        # 精选猪猪
│  ├─ AllView.vue         # 全部猪猪
│  └─ UploadView.vue      # 添加猪猪
├─ App.vue                # 公共页面骨架
├─ main.ts                # Vue 入口
├─ router.ts              # 路由表
├─ style.css              # 全站视觉和响应式规则
└─ types.ts               # PigImage 类型
```

## 3. 从零实现步骤

### 第一步：创建 Vue 项目

```bash
npm create vite@latest pighub -- --template vue-ts
cd pighub
npm install
npm install vue-router
```

入口文件只负责加载根组件、路由和全局样式：

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

createApp(App).use(router).mount('#app')
```

### 第二步：建立三页路由

在 `src/router.ts` 中使用 HTML5 History：

```ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/all', component: AllView },
    { path: '/upload', component: UploadView },
  ],
})
```

根组件保留公共头部和页脚，中间交给 `RouterView`：

```vue
<PigHeader />
<RouterView />
<PigFooter />
```

这样切换页面时，导航和页脚不会重复创建。

### 第三步：定义图库数据

先声明统一类型：

```ts
export interface PigImage {
  id: number
  title: string
  file: string
  views: number
  downloads: number
  createdAt: number
}
```

`pigImages.ts` 将展示数据集中管理。真实项目可把该数组替换成：

```ts
const response = await fetch('/api/images')
const images = await response.json()
```

页面和卡片只依赖 `PigImage`，因此更换数据源时不需要重写 UI。

### 第四步：实现公共导航

导航包含三部分：

1. `RouterLink` Logo。
2. 使用 `v-model` 绑定的搜索框。
3. 三个路由链接。

搜索词放在模块级 `ref` 中：

```ts
export const searchQuery = ref('')
```

模块级响应式状态会被不同页面共享。用户在任何页面输入搜索词，精选页和全部页都会立刻重新计算结果。

提交搜索表单时跳转到全部页面：

```ts
function submitSearch() {
  void router.push({ name: 'all' })
}
```

### 第五步：实现可复用卡片

`PigCard.vue` 接收一个 `pig` 属性：

```ts
defineProps<{ pig: PigImage }>()
```

卡片负责：

- 展示正方形图片。
- 展示名称、浏览量和下载量。
- 点击下载按钮创建临时 `<a>` 元素。
- 点击卡片使用 Clipboard API 复制图片 URL。

下载按钮使用 `@click.stop`，防止冒泡触发卡片复制：

```vue
<button @click.stop="downloadImage">...</button>
```

### 第六步：实现精选页

精选页维护三个状态：

```ts
const activeFilter = ref<'latest' | 'popular' | 'random'>('latest')
const visibleCount = ref(12)
const randomSeed = ref(0)
```

使用 `computed` 完成搜索和排序。视图只渲染：

```ts
filteredImages.value.slice(0, visibleCount.value)
```

“加载更多”只增加 `visibleCount`，不修改源数组。这种写法简单、可预测，也方便以后替换为服务端分页。

随机排序不直接破坏原始数据，而是复制数组后按临时种子排序。再次点击“随机”会生成新种子。

### 第七步：实现全部页

全部页复用同一个卡片和搜索状态，只改变排序规则：

- `name`：`localeCompare(..., 'zh-CN')`
- `latest`：创建时间倒序
- `earliest`：创建时间正序

标题旁的总数直接读取搜索后的数组长度：

```vue
全部猪猪 <span>({{ sortedImages.length }})</span>
```

### 第八步：实现上传页

文件选择支持两种入口：

- 点击上传区，触发隐藏的文件输入框。
- 把文件拖入上传区，通过 `DragEvent.dataTransfer.files` 读取。

选择文件后依次校验：

1. MIME 类型必须是 JPEG、PNG、GIF 或 WebP。
2. 文件大小不能超过 10MB。
3. 使用 `URL.createObjectURL(file)` 生成本地预览。

组件卸载或移除文件时必须执行：

```ts
URL.revokeObjectURL(previewUrl)
```

这可以释放浏览器为本地文件建立的临时内存引用。

上传按钮要求“文件和名称都存在”：

```ts
const canUpload = computed(
  () => Boolean(selectedFile.value && imageName.value.trim()),
)
```

当前项目用定时器模拟上传进度。接真实后端时，把 `upload()` 替换为 `fetch` 或 Axios 的上传请求即可。

### 第九步：复刻视觉样式

全局视觉变量来自目标站的实际页面参数：

- 页面背景：`#0f0f0f`
- 顶部与页脚：`#000`
- 卡片：`#1a1a1a`
- 强调色：`#ff9000`
- 高亮色：`#ffb000`
- 内容最大宽度：`1200px`

图片网格断点：

```css
/* 桌面 */
grid-template-columns: repeat(4, 1fr);

/* 平板 */
@media (max-width: 1023px) {
  grid-template-columns: repeat(3, 1fr);
}

/* 手机 */
@media (max-width: 767px) {
  grid-template-columns: repeat(2, 1fr);
}
```

图片用 `aspect-ratio: 1` 和 `object-fit: contain` 保证卡片排列整齐，同时不裁掉表情包内容。

导航在小屏幕变为纵向布局，搜索框占满整行；图片类型标签在极窄屏隐藏，为统计和下载按钮留出空间。

## 4. 关键 Vue 知识点

### `ref`

用于会变化的基础状态，例如筛选条件、文件和上传进度。

### `computed`

用于从源状态推导结果，例如搜索结果、排序结果、按钮是否可用。不要把可以计算出的值重复存进另一个 `ref`。

### 组件属性

卡片通过 Props 接收数据，避免每个页面重复卡片 HTML。

### 组合式函数

`usePigSearch` 封装共享搜索状态，让头部和页面之间保持低耦合。

### 生命周期

`onBeforeUnmount` 用来清理定时器和对象 URL，避免内存泄漏。

### 路由

`RouterLink` 自动处理无刷新导航，并通过 `router-link-exact-active` 提供当前页面高亮状态。

## 5. 本地运行与验证

开发模式：

```bash
npm run dev
```

访问：

- `http://localhost:5173/`
- `http://localhost:5173/all`
- `http://localhost:5173/upload`

生产检查：

```bash
npm run build
npm run preview
```

手工验收清单：

1. 三个导航链接均可无刷新切换，当前链接显示橙色。
2. 搜索“飞机”后只显示名称包含“飞机”的图片。
3. “最热”按浏览量倒序，“随机”每次点击改变顺序。
4. “加载更多”会追加卡片。
5. 下载按钮不会触发卡片复制提示。
6. 上传页未选择图片时按钮禁用。
7. 拖入合法图片后出现预览，移除按钮能清空预览。
8. 超过 10MB 或格式不支持时显示错误。
9. 视口小于 768px 时显示两列图库和纵向导航。

## 6. 接入真实后端

学习完成后可增加以下 API：

```text
GET  /api/images?sort=latest&page=1
POST /api/images
POST /api/images/:id/view
GET  /api/images/:id/download
```

建议将请求封装到 `src/services/pigApi.ts`，页面只调用服务函数，不直接散落 `fetch`。上传使用 `FormData`，服务端需要重新校验文件类型、大小和文件名，不能只信任浏览器校验。

## 7. 部署注意事项

项目使用 `createWebHistory()`。部署到静态服务器时，需要把未知路径回退到 `index.html`，否则直接访问 `/all` 会返回 404。

Nginx 示例：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

若部署环境不能配置回退，可改用 `createWebHashHistory()`。

## 8. 学习与版权说明

此实现用于 Vue 技术学习。目标站的品牌文字、页面设计和图片资源不应直接用于商业发布。正式上线前应替换 Logo、文案和图片，并确认素材授权。
