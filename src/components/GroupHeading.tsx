import { stringToColor, stringToColorDark } from '@/utils/lib'

export const GroupHeading = ({ group }: { group: string }) => {
  if (!group || group === 'null') return null
  return (
    <h3
      className='text-xl font-medium mt-4 mb-2 p-2 px-4 rounded-md'
      style={{
        backgroundColor: stringToColor(group, 0.1),
        color: stringToColorDark(group)
      }}
    >
      {group}
    </h3>
  )
}
