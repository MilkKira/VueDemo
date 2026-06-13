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
                d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0-2.27 4.23l-.28.27v.79l5 4.99L20.49 19l-4.99-5ZM9.5 14A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14Z"
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
