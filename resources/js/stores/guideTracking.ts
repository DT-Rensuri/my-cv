import { ref } from 'vue';
import { defineStore } from 'pinia';

/**
 * Tracks which CV sections the visitor has been shown / visited so the guide
 * can offer a coherent tour and avoid repeating itself.
 */
export const useGuideTrackingStore = defineStore('guideTracking', () => {
  const visited = ref<string[]>([]);
  const tourActive = ref(false);

  function markVisited(section: string) {
    if (!visited.value.includes(section)) {
      visited.value.push(section);
    }
  }

  function reset() {
    visited.value = [];
    tourActive.value = false;
  }

  return {
    visited,
    tourActive,
    markVisited,
    reset,
  };
});