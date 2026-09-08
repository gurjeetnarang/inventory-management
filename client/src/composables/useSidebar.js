import { ref } from 'vue'

// Shared sidebar state (singleton pattern) - used for the mobile off-canvas drawer
const mobileOpen = ref(false)

export function useSidebar() {
  const openMobileSidebar = () => {
    mobileOpen.value = true
  }

  const closeMobileSidebar = () => {
    mobileOpen.value = false
  }

  const toggleMobileSidebar = () => {
    mobileOpen.value = !mobileOpen.value
  }

  return {
    mobileOpen,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar
  }
}
