export default function Loading() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <img src='/ball.svg' alt='loading...' className='mb-2 w-40 h-40' />
      <span className='text-gray-700 text-lg font-medium'>
        Loading World Cup 2026 Schedule...
      </span>
    </div>
  )
}