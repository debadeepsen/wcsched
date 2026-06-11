'use client'

import { DateIconSVG } from './DateIconSVG'
import { formatMatchDate } from '@/utils/lib'

export const CardDateDisplay = ({ utcDate }: { utcDate: string }) => {
  const { date, time } = formatMatchDate(utcDate)
  return (
    <>
      {' '}
      <DateIconSVG />
      {date}{' '}
      <span className='ml-1 text-md font-bold text-gray-500 dark:text-gray-300'>
        {time}
      </span>
    </>
  )
}
