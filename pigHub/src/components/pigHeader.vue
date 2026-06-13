<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePigSearch } from '../composables/usePigSearch'

const router = useRouter()
const { searchQuery } = usePigSearch()

function submitSearch() {
  void router.push({ name: 'all' })
}
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="nav-wrapper">
        <RouterLink class="logo" to="/" aria-label="PigHub 首页">
          <span class="logo-text">Pig</span><span class="logo-hub">Hub</span
          ><span class="logo-emoji">🐖</span>
        </RouterLink>

        <form class="search-container" @submit.prevent="submitSearch">
          <input
            v-model="searchQuery"
            class="search-input"
            type="search"
            placeholder="搜索可爱的小猪"
            autocomplete="off"
          />
          <button class="search-btn" type="submit" aria-label="搜索">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
          </button>
        </form>

        <nav class="nav-menu" aria-label="主导航">
          <RouterLink class="nav-link" to="/">精选猪猪</RouterLink>
          <RouterLink class="nav-link" to="/all">全部猪猪</RouterLink>
          <RouterLink class="nav-link" to="/upload">添加猪猪</RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>
