'use client'

import { Icon } from '@iconify/react'

export default function ScrollToTodayButton() {

  const scrollToToday = () => {
    const todayTag = document.getElementById('today-tag')
    if (todayTag) {
      const top = todayTag.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <button
      onClick={scrollToToday}
      className='fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-red-700 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center'
      aria-label='Scroll to today'
      title='Scroll to today'
    >
      <Icon icon='mdi:calendar-today' className='w-6 h-6' />
    </button>
  )
}
