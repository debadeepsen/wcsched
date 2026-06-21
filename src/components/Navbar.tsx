'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import SoccerBallIcon from '@iconify-react/fluent-emoji-flat/soccer-ball'

type Theme = 'light' | 'dark' | 'system'

const NAV_LINKS = [
  { href: '/', label: 'Schedule', icon: 'lucide:calendar-days' },
  { href: '/standings', label: 'Standings', icon: 'lucide:trophy' }
]

const THEME_META: Record<Theme, { label: string; icon: string }> = {
  light: { label: 'Light', icon: 'lucide:sun' },
  dark: { label: 'Dark', icon: 'lucide:moon' },
  system: { label: 'System', icon: 'lucide:laptop' }
}

export default function Navbar() {
  const pathname = usePathname()
  const [theme, setTheme] = useState<Theme>('system')
  const [menuOpen, setMenuOpen] = useState(false)

  const applyTheme = (mode: Theme) => {
    const root = document.documentElement
    if (mode === 'light') {
      root.classList.remove('dark')
    } else if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.toggle(
        'dark',
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) {
      setTheme(saved)
      applyTheme(saved)
    } else {
      applyTheme('system')
    }
  }, [])

  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme])

  const cycleTheme = () => {
    const order: Theme[] = ['light', 'dark', 'system']
    const next = order[(order.indexOf(theme) + 1) % order.length]
    setTheme(next)
    localStorage.setItem('theme', next)
    applyTheme(next)
  }

  return (
    <nav className='sticky top-0 z-50 border-b border-gray-200 dark:border-white/5 bg-white/90 dark:bg-[#1a1717]/90 backdrop-blur-md'>
      <div className='container mx-auto px-4 h-14 flex items-center justify-between gap-4'>
        {/* Brand */}
        <div className='flex items-center gap-2 shrink-0'>
          <SoccerBallIcon className='w-8 h-8 text-red-600' />
          <span className='font-semibold text-gray-800 dark:text-gray-200 text-sm hidden sm:block tracking-tight'>
            WC 2026
          </span>
        </div>

        {/* Desktop nav links */}
        <div className='hidden sm:flex items-center gap-1 flex-1 justify-center'>
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-red-700/10 text-red-700 dark:bg-red-300/10 dark:text-red-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon icon={icon} fontSize={14} />
                {label}
              </Link>
            )
          })}
        </div>

        {/* Right: theme toggle + mobile menu button */}
        <div className='flex items-center gap-2 shrink-0'>
          <button
            id='theme-toggle-btn'
            onClick={cycleTheme}
            className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-xs font-medium'
            title={`Current: ${THEME_META[theme].label}. Click to cycle.`}
          >
            <Icon icon={THEME_META[theme].icon} fontSize={14} />
            <span className='hidden md:inline'>{THEME_META[theme].label}</span>
          </button>

          {/* Hamburger — mobile only */}
          <button
            id='mobile-menu-btn'
            className='sm:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors'
            onClick={() => setMenuOpen(o => !o)}
            aria-label='Toggle menu'
          >
            <Icon icon={menuOpen ? 'lucide:x' : 'lucide:menu'} fontSize={18} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className='sm:hidden border-t border-gray-100 dark:border-white/5 px-4 pb-3 pt-2 flex flex-col gap-1 bg-white/95 dark:bg-[#1a1717]/95 backdrop-blur-md'>
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-700/10 text-red-700 dark:bg-red-300/10 dark:text-red-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon icon={icon} fontSize={16} />
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
