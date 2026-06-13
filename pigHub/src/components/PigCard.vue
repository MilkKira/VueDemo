<script setup lang="ts">
import type { PigImage } from '../types/types'

const props = defineProps<{ pig: PigImage }>()

async function downloadImage() {
  const fileName = decodeURIComponent(
    props.pig.file.split('/').pop() ?? `${props.pig.title}.jpg`,
  )

  try {
    const response = await fetch(props.pig.file)
    if (!response.ok) throw new Error(`Download failed: ${response.status}`)

    const blobUrl = URL.createObjectURL(await response.blob())
    triggerBrowserDownload(blobUrl, fileName)
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  } catch {
    triggerBrowserDownload(props.pig.file, fileName)
  }
}

function triggerBrowserDownload(url: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

async function copyImageUrl() {
  try {
    await navigator.clipboard.writeText(props.pig.file)
  } catch {}
}
</script>

<template>
  <article class="gallery-item" @click="copyImageUrl">
    <img :src="pig.file" :alt="pig.title" class="gallery-image" loading="lazy" />
    <div class="gallery-info">
      <h3 class="gallery-title">{{ pig.title }}</h3>
      <div class="gallery-meta">
        <span class="gallery-duration">静态图片</span>
        <div class="stats-container">
          <span class="view-count" title="浏览次数">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {{ pig.views }}
          </span>
          <button class="download-btn" type="button" title="下载图片" @click.stop="downloadImage">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            <span class="download-count">{{ pig.downloads }}</span>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
