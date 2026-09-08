<template>
  <div
    class="sidebar-overlay"
    v-if="mobileOpen"
    @click="closeMobileSidebar"
  ></div>

  <aside class="sidebar" :class="{ collapsed: collapsed, 'mobile-open': mobileOpen }">
    <div class="sidebar-brand">
      <div class="brand-mark">{{ companyInitial }}</div>
      <div class="brand-text">
        <h1 class="brand-title">{{ t('nav.companyName') }}</h1>
        <span class="brand-subtitle">{{ t('nav.subtitle') }}</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link
        to="/"
        class="nav-item"
        :class="{ active: $route.path === '/' }"
        @click="closeMobileSidebar"
      >
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="8" height="8" rx="1.5" />
            <rect x="13" y="3" width="8" height="8" rx="1.5" />
            <rect x="3" y="13" width="8" height="8" rx="1.5" />
            <rect x="13" y="13" width="8" height="8" rx="1.5" />
          </svg>
        </span>
        <span class="nav-label">{{ t('nav.overview') }}</span>
      </router-link>

      <router-link
        to="/inventory"
        class="nav-item"
        :class="{ active: $route.path === '/inventory' }"
        @click="closeMobileSidebar"
      >
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 8l9-5 9 5-9 5-9-5z" />
            <path d="M3 8v8l9 5 9-5V8" />
            <path d="M12 13v8" />
          </svg>
        </span>
        <span class="nav-label">{{ t('nav.inventory') }}</span>
      </router-link>

      <router-link
        to="/orders"
        class="nav-item"
        :class="{ active: $route.path === '/orders' }"
        @click="closeMobileSidebar"
      >
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="4" width="14" height="17" rx="1.5" />
            <path d="M9 3h6v3H9z" />
            <path d="M8 11h8M8 14h8M8 17h5" />
          </svg>
        </span>
        <span class="nav-label">{{ t('nav.orders') }}</span>
      </router-link>

      <router-link
        to="/demand"
        class="nav-item"
        :class="{ active: $route.path === '/demand' }"
        @click="closeMobileSidebar"
      >
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M15 6h6v6" />
          </svg>
        </span>
        <span class="nav-label">{{ t('nav.demandForecast') }}</span>
      </router-link>

      <router-link
        to="/spending"
        class="nav-item"
        :class="{ active: $route.path === '/spending' }"
        @click="closeMobileSidebar"
      >
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20" />
            <path d="M17 6.5c0-1.7-2.2-3-5-3s-5 1.3-5 3 2.2 3 5 3 5 1.3 5 3-2.2 3-5 3-5-1.3-5-3" />
          </svg>
        </span>
        <span class="nav-label">{{ t('nav.finance') }}</span>
      </router-link>

      <router-link
        to="/reports"
        class="nav-item"
        :class="{ active: $route.path === '/reports' }"
        @click="closeMobileSidebar"
      >
        <span class="nav-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 20V10" />
            <path d="M11 20V4" />
            <path d="M18 20v-7" />
          </svg>
        </span>
        <span class="nav-label">Set of Reports</span>
      </router-link>
    </nav>

    <button
      class="collapse-toggle"
      @click="toggleCollapsed"
      :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="collapse-icon"
        :class="{ flipped: collapsed }"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      <span class="nav-label" v-if="!collapsed">Collapse</span>
    </button>
  </aside>
</template>

<script>
import { ref, computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useSidebar } from '../composables/useSidebar'

export default {
  name: 'AppSidebar',
  setup() {
    const { t } = useI18n()
    const { mobileOpen, closeMobileSidebar } = useSidebar()

    const collapsed = ref(false)

    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value
    }

    const companyInitial = computed(() => {
      const name = t('nav.companyName')
      return name ? name.charAt(0).toUpperCase() : ''
    })

    return {
      t,
      collapsed,
      toggleCollapsed,
      mobileOpen,
      closeMobileSidebar,
      companyInitial
    }
  }
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  z-index: 199;
  display: none;
}

.sidebar {
  width: var(--sidebar-width-expanded);
  flex-shrink: 0;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  transition: width 0.2s ease;
  z-index: 200;
  overflow-x: hidden;
}

.sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  min-height: 70px;
}

.brand-mark {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.brand-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
  white-space: nowrap;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.sidebar.collapsed .brand-text {
  display: none;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-3);
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-item:hover {
  color: var(--color-text-primary);
  background: #f1f5f9;
}

.nav-item.active {
  color: var(--color-accent);
  background: var(--color-accent-bg);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
}

.sidebar.collapsed .nav-label {
  display: none;
}

.collapse-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: var(--space-3);
  padding: var(--space-3);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  transition: all 0.2s ease;
}

.collapse-toggle:hover {
  background: #f1f5f9;
  color: var(--color-text-primary);
}

.collapse-icon {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.collapse-icon.flipped {
  transform: rotate(180deg);
}

.sidebar.collapsed .collapse-toggle {
  justify-content: center;
}

@media (max-width: 1024px) {
  .sidebar:not(.mobile-open) {
    width: var(--sidebar-width-collapsed);
  }

  .sidebar:not(.mobile-open) .brand-text,
  .sidebar:not(.mobile-open) .nav-label {
    display: none;
  }

  .sidebar:not(.mobile-open) .nav-item,
  .sidebar:not(.mobile-open) .collapse-toggle {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: var(--sidebar-width-expanded);
    transform: translateX(-100%);
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
    width: var(--sidebar-width-expanded);
  }

  .sidebar.mobile-open .brand-text,
  .sidebar.mobile-open .nav-label {
    display: flex;
  }

  .sidebar.mobile-open .nav-item,
  .sidebar.mobile-open .collapse-toggle {
    justify-content: flex-start;
  }

  .sidebar-overlay {
    display: block;
  }
}
</style>
