'use client'

import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')

  // Initialize theme on client mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) {
      setTheme(saved)
      applyTheme(saved)
    } else {
      // follow system preference
      applyTheme('system')
    }
  }, [])

  const applyTheme = (mode: Theme) => {
    const root = document.documentElement
    if (mode === 'light') {
      root.classList.remove('dark')
    } else if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      if (prefersDark.matches) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  // Listen for system preference changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme])
  const toggle = () => {
    const next =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(next as Theme)
    localStorage.setItem('theme', next)
    applyTheme(next as Theme)
  }

  const toggles = {
    light: {
      text: 'Dark',
      icon: 'lucide:moon',
    },
    dark: {
      text: 'Light',
      icon: 'lucide:sun'
    },
    system: {
      text: 'System',
      icon: 'lucide:laptop'
    }
  }

  return (
    <button
      onClick={toggle}
      className='fixed top-2 right-2 p-2 rounded bg-gray-200 dark:bg-[#0004] text-gray-800 dark:text-gray-200 text-xs flex items-center gap-2'
    >
      Switch to {toggles[theme].text} <Icon inline icon={toggles[theme].icon} fontSize={16} />
    </button>
  )
}
