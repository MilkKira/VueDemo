<script setup lang="ts">
import { computed, ref } from 'vue'
import PigCard from '../components/PigCard.vue'
import { usePigSearch } from '../composables/usePigSearch'
import { pigImages } from '../data/pigImages'

type Filter = 'latest' | 'popular' | 'random'

const activeFilter = ref<Filter>('latest')
const visibleCount = ref(12)
const randomSeed = ref(0)
const { normalizedQuery } = usePigSearch()

const filteredImages = computed(() => {
  const query = normalizedQuery.value
  let images = query ? pigImages.filter((pig) => pig.title.toLocaleLowerCase().includes(query)) : [...pigImages]

  if (activeFilter.value === 'popular') images.sort((a, b) => b.views - a.views)
  if (activeFilter.value === 'latest') images.sort((a, b) => b.createdAt - a.createdAt)
  if (activeFilter.value === 'random') {
    const seed = randomSeed.value
    images.sort((a, b) => ((a.id * 9301 + seed) % 49297) - ((b.id * 9301 + seed) % 49297))
  }

  return images
})

const visibleImages = computed(() => filteredImages.value.slice(0, visibleCount.value))

function setFilter(filter: Filter) {
  activeFilter.value = filter
  visibleCount.value = 12
  if (filter === 'random') randomSeed.value = Date.now()
}
</script>

<template>
  <main class="main-content">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">热门猪猪推荐</h1>
        <div class="section-filters">
          <button
            v-for="item in [
              ['latest', '最新'],
              ['popular', '最热'],
              ['random', '随机'],
            ] as const"
            :key="item[0]"
            class="filter-btn"
            :class="{ active: activeFilter === item[0] }"
            type="button"
            @click="setFilter(item[0])"
          >
            {{ item[1] }}
          </button>
        </div>
      </div>

      <div v-if="visibleImages.length" class="gallery-grid">
        <PigCard v-for="pig in visibleImages" :key="pig.id" :pig="pig" />
      </div>
      <p v-else class="empty-state">没有找到这只猪猪，换个关键词试试吧。</p>

      <div v-if="visibleCount < filteredImages.length" class="load-more-container">
        <button class="load-more-btn" type="button" @click="visibleCount += 8">
          加载更多可爱猪猪
        </button>
      </div>
    </div>
  </main>
</template>
