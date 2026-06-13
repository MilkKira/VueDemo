<script setup lang="ts">
import { ref } from 'vue'
import type { PigImage } from '../types/types'

const props = defineProps<{ pig: PigImage }>()
const copied = ref(false)

async function downloadImage() {
  const anchor = document.createElement('a')
  anchor.href = props.pig.file
  anchor.download = props.pig.file.split('/').pop() ?? `${props.pig.title}.jpg`
  anchor.target = '_blank'
  anchor.rel = 'noopener'
  anchor.click()
}

async function copyImageUrl() {
  try {
    await navigator.clipboard.writeText(props.pig.file)
    copied.value = true
    window.setTimeout(() => (copied.value = false), 1800)
  } catch {
    copied.value = false
  }
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {{ pig.views }}
          </span>
          <button class="download-btn" type="button" title="下载图片" @click.stop="downloadImage">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            <span class="download-count">{{ pig.downloads }}</span>
          </button>
        </div>
      </div>
    </div>
    <Transition name="notice">
      <span v-if="copied" class="copy-notification">猪猪图片地址已复制</span>
    </Transition>
  </article>
</template>
