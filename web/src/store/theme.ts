import { create } from 'zustand'

export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'blog_theme'

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  // 跟随系统偏好
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

interface ThemeState {
  mode: ThemeMode
  isDark: boolean
  toggle: () => void
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: getInitialTheme(),
  isDark: getInitialTheme() === 'dark',

  toggle: () => {
    const next = get().mode === 'light' ? 'dark' : 'light'
    localStorage.setItem(THEME_KEY, next)
    document.documentElement.setAttribute('data-theme', next)
    set({ mode: next, isDark: next === 'dark' })
  },

  setMode: (mode: ThemeMode) => {
    localStorage.setItem(THEME_KEY, mode)
    document.documentElement.setAttribute('data-theme', mode)
    set({ mode, isDark: mode === 'dark' })
  },
}))
