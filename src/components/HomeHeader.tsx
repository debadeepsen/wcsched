import CalendarButton from './CalendarButton'
import type { Match } from '@/app/types/types'

interface HomeHeaderProps {
  allMatches: Match[]
}

export default function HomeHeader({ allMatches }: HomeHeaderProps) {
  return (
    <header className='text-center mt-4 mb-8'>
      <h1 className='text-4xl md:text-6xl font-bold dark:font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center gap-6'>
        <img src='/fifawc.png' width={60} height={60} alt='FIFA World Cup 2026 Logo' />
        FIFA World Cup 2026
      </h1>
      <p className='text-xl text-red-600 mb-6'>Match Schedule & Fixtures</p>
      <div className='flex justify-center'>
        <CalendarButton matches={allMatches} />
      </div>
    </header>
  )
}
