import { computed, ref } from 'vue'

export const searchQuery = ref('')

export function usePigSearch() {
  const normalizedQuery = computed(() => searchQuery.value.trim().toLocaleLowerCase())

  return { searchQuery, normalizedQuery }
}
