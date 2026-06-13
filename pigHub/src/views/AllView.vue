<script setup lang="ts">
import { computed, ref } from 'vue'
import PigCard from '../components/PigCard.vue'
import { usePigSearch } from '../composables/usePigSearch'
import { pigImages } from '../data/pigImages'

type Sort = 'name' | 'latest' | 'earliest'

const activeSort = ref<Sort>('name')
const visibleCount = ref(12)
const { normalizedQuery } = usePigSearch()

const sortedImages = computed(() => {
  const query = normalizedQuery.value
  const images = query
    ? pigImages.filter((pig) => pig.title.toLocaleLowerCase().includes(query))
    : [...pigImages]

  return images.sort((a, b) => {
    if (activeSort.value === 'latest') return b.createdAt - a.createdAt
    if (activeSort.value === 'earliest') return a.createdAt - b.createdAt
    return a.title.localeCompare(b.title, 'zh-CN')
  })
})

const visibleImages = computed(() => sortedImages.value.slice(0, visibleCount.value))

function setSort(sort: Sort) {
  activeSort.value = sort
  visibleCount.value = 12
}
</script>

<template>
  <main class="main-content">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">
          全部猪猪 <span class="total-count">({{ sortedImages.length }})</span>
        </h1>
        <div class="section-filters">
          <button
            v-for="item in [
              ['name', '按名称'],
              ['latest', '最新'],
              ['earliest', '最早'],
            ] as const"
            :key="item[0]"
            class="filter-btn"
            :class="{ active: activeSort === item[0] }"
            type="button"
            @click="setSort(item[0])"
          >
            {{ item[1] }}
          </button>
        </div>
      </div>

      <div v-if="visibleImages.length" class="gallery-grid">
        <PigCard v-for="pig in visibleImages" :key="pig.id" :pig="pig" />
      </div>
      <p v-else class="empty-state">没有找到匹配的猪猪。</p>

      <div v-if="visibleCount < sortedImages.length" class="load-more-container">
        <button class="load-more-btn" type="button" @click="visibleCount += 8">加载更多猪猪</button>
      </div>
    </div>
  </main>
</template>
