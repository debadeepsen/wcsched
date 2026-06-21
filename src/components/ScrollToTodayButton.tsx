'use client'

import { Icon } from '@iconify/react'

export default function ScrollToTodayButton() {

  const scrollToToday = () => {
    const todayTag = document.getElementById('today-tag')
    if (todayTag) {
      const top = todayTag.getBoundingClientRect().top - 30;
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <button
      onClick={scrollToToday}
      className='fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center dark:bg-blue-500 dark:hover:bg-blue-600'
      aria-label='Scroll to today'
      title='Scroll to today'
    >
      <Icon icon='mdi:calendar-today' className='w-6 h-6' />
    </button>
  )
}
