<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const fileInput = ref<HTMLInputElement>()
const selectedFile = ref<File>()
const imageName = ref('')
const previewUrl = ref('')
const isDragging = ref(false)
const isUploading = ref(false)
const progress = ref(0)
const result = ref('')
let uploadTimer: number | undefined

const canUpload = computed(() => Boolean(selectedFile.value && imageName.value.trim()))

function chooseFile() {
  fileInput.value?.click()
}

function useFile(file?: File) {
  if (!file) return
  if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
    result.value = '请选择 JPG、PNG、GIF 或 WebP 图片。'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    result.value = '图片不能超过 10MB。'
    return
  }

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  selectedFile.value = file
  imageName.value ||= file.name.replace(/\.[^.]+$/, '')
  previewUrl.value = URL.createObjectURL(file)
  result.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  useFile(event.dataTransfer?.files[0])
}

function removeImage() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  selectedFile.value = undefined
  previewUrl.value = ''
  progress.value = 0
  result.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function upload() {
  if (!canUpload.value || isUploading.value) return
  isUploading.value = true
  progress.value = 0
  result.value = ''

  uploadTimer = window.setInterval(() => {
    progress.value += 10
    if (progress.value >= 100) {
      window.clearInterval(uploadTimer)
      isUploading.value = false
      result.value = '上传成功！这是学习版演示，图片仅保留在当前浏览器预览中。'
    }
  }, 90)
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  if (uploadTimer) window.clearInterval(uploadTimer)
})
</script>

<template>
  <main class="main-content">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">添加可爱的猪猪</h1>
      </div>

      <div class="upload-container">
        <form class="upload-form" @submit.prevent="upload">
          <input
            ref="fileInput"
            class="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            @change="useFile(($event.target as HTMLInputElement).files?.[0])"
          />

          <div v-if="!previewUrl">
            <button
              class="upload-area"
              :class="{ dragover: isDragging }"
              type="button"
              @click="chooseFile"
              @dragenter.prevent="isDragging = true"
              @dragover.prevent
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <svg class="upload-icon" width="58" height="58" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16h6v-6h4l-7-7-7 7h4v6Zm-4 2h14v2H5v-2Z" />
              </svg>
              <span class="upload-text">
                <strong>点击或拖拽上传猪猪图片</strong>
                <small>支持 JPG、PNG、GIF 格式，最大 10MB</small>
              </span>
            </button>
          </div>

          <div v-else class="preview-container">
            <img class="preview-image" :src="previewUrl" alt="待上传猪猪预览" />
            <button class="remove-image" type="button" aria-label="移除图片" @click="removeImage">×</button>
          </div>

          <div class="form-group">
            <label for="image-name">图片名称</label>
            <input
              id="image-name"
              v-model="imageName"
              type="text"
              placeholder="给你的猪猪图起个可爱的名字"
            />
          </div>

          <p class="review-tip">由网站站猪审核后显示，没审核说明在猪睡觉</p>

          <div class="upload-actions">
            <button class="upload-btn" type="submit" :disabled="!canUpload || isUploading">
              {{ isUploading ? '上传中...' : '上传猪猪' }}
            </button>
          </div>

          <div v-if="isUploading" class="upload-progress">
            <div class="progress-bar"><div class="progress-fill" :style="{ width: `${progress}%` }" /></div>
            <p class="progress-text">{{ progress }}%</p>
          </div>

          <p v-if="result" class="upload-result" :class="{ success: progress >= 100 }">{{ result }}</p>
        </form>
      </div>
    </div>
  </main>
</template>
