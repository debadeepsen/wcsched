'use client'

import { stringToColor, stringToColorDark } from '@/utils/lib'

export const GroupHeading = ({
  group,
  applyBg = false
}: {
  group: string
  applyBg?: boolean
}) => {
  if (!group || group === 'null') return null

  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark')

  return (
    <h3
      className='text-xl font-medium mt-4 mb-2 rounded-md'
      style={{
        backgroundColor: applyBg ? stringToColor(group, 0.1) : 'transparent',
        color: isDarkMode ? stringToColor(group) : stringToColorDark(group)
      }}
    >
      {group}
    </h3>
  )
}
