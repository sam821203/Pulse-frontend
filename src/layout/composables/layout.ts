import { computed, reactive, readonly, type ComputedRef, type DeepReadonly } from 'vue'

interface ViewTransition {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
  skipTransition(): void
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => ViewTransition
}

interface LayoutConfig {
  preset: string
  primary: string
  surface: string | null
  darkTheme: boolean
  menuMode: 'static' | 'overlay' | string
}

interface LayoutState {
  staticMenuDesktopInactive: boolean
  overlayMenuActive: boolean
  profileSidebarVisible: boolean
  configSidebarVisible: boolean
  staticMenuMobileActive: boolean
  menuHoverActive: boolean
  activeMenuItem: string | null
}

export interface UseLayoutReturn {
  layoutConfig: DeepReadonly<LayoutConfig>
  layoutState: DeepReadonly<LayoutState>
  onMenuToggle: () => void
  isSidebarActive: ComputedRef<boolean>
  isDarkTheme: ComputedRef<boolean>
  getPrimary: ComputedRef<string>
  getSurface: ComputedRef<string | null>
  setActiveMenuItem: (item: string | { value: string }) => void
  toggleDarkMode: () => void
  setPrimary: (value: string) => void
  setSurface: (value: string | null) => void
  setPreset: (value: string) => void
  resetMenu: () => void
  setMenuMode: (mode: LayoutConfig['menuMode']) => void
}

const layoutConfig = reactive<LayoutConfig>({
  preset: 'Aura',
  primary: 'emerald',
  surface: null,
  darkTheme: false,
  menuMode: 'static'
})

const layoutState = reactive<LayoutState>({
  staticMenuDesktopInactive: false,
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
  activeMenuItem: null
})

export function useLayout(): UseLayoutReturn {
  const setPrimary = (value: string) => {
    layoutConfig.primary = value
  }

  const setSurface = (value: string | null) => {
    layoutConfig.surface = value
  }

  const setPreset = (value: string) => {
    layoutConfig.preset = value
  }

  const setActiveMenuItem = (item: string | { value: string }) => {
    layoutState.activeMenuItem = typeof item === 'string' ? item : item.value
  }

  const setMenuMode = (mode: LayoutConfig['menuMode']) => {
    layoutConfig.menuMode = mode
  }

  const executeDarkModeToggle = () => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme
    document.documentElement.classList.toggle('app-dark')
  }

  const toggleDarkMode = () => {
    const doc = document as DocumentWithViewTransition

    if (!doc.startViewTransition) {
      executeDarkModeToggle()
      return
    }

    doc.startViewTransition(() => executeDarkModeToggle())
  }

  const onMenuToggle = () => {
    if (layoutConfig.menuMode === 'overlay') {
      layoutState.overlayMenuActive = !layoutState.overlayMenuActive
    }

    if (window.innerWidth > 991) {
      layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive
    } else {
      layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive
    }
  }

  const resetMenu = () => {
    layoutState.overlayMenuActive = false
    layoutState.staticMenuMobileActive = false
    layoutState.menuHoverActive = false
  }

  const isSidebarActive = computed(
    () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive
  )

  const isDarkTheme = computed(() => layoutConfig.darkTheme)

  const getPrimary = computed(() => layoutConfig.primary)

  const getSurface = computed(() => layoutConfig.surface)

  return {
    layoutConfig: readonly(layoutConfig),
    layoutState: readonly(layoutState),
    onMenuToggle,
    isSidebarActive,
    isDarkTheme,
    getPrimary,
    getSurface,
    setActiveMenuItem,
    toggleDarkMode,
    setPrimary,
    setSurface,
    setPreset,
    resetMenu,
    setMenuMode
  }
}
