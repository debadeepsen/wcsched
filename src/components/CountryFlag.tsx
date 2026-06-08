import { COUNTRY_ISO2 } from '@/utils/lib'

export const CountryFlag = ({ team }: { team: string }) => {
  // if team is undefined, display a box
  if (!team || !COUNTRY_ISO2[team]) {
    return <div className='w-6 h-4 mr-1 text-gray-400 bg-gray-100 border border-gray-200' />
  }
  return (
    <img
      alt={team}
      src={
        'https://purecatamphetamine.github.io/country-flag-icons/3x2/' +
        COUNTRY_ISO2[team] +
        '.svg'
      }
      className='w-6 h-4 mr-1 text-gray-400 border border-gray-200'
    />
  )
}
