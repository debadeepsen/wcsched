'use client'

import React, { useState } from 'react'
import type { Match } from '../app/types/types'
import CalendarExportModal from './CalendarExportModal'

interface CalendarButtonProps {
  matches: Match[]
}

export default function CalendarButton({ matches }: CalendarButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <line x1="8" y1="14" x2="8.01" y2="14"></line>
          <line x1="12" y1="14" x2="12.01" y2="14"></line>
          <line x1="16" y1="14" x2="16.01" y2="14"></line>
          <line x1="8" y1="18" x2="8.01" y2="18"></line>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
          <line x1="16" y1="18" x2="16.01" y2="18"></line>
        </svg>
        Add to Calendar
      </button>
      
      {isModalOpen && (
        <CalendarExportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          matches={matches}
        />
      )}
    </>
  )
}
