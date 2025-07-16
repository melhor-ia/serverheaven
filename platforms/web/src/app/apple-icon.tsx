import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const size = {
  width: 180,
  height: 180,
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(to bottom right, #10B981, #059669)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <svg width="66%" height="66%" viewBox="0 0 24 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
           <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
           <circle cx="12" cy="12" r="3" />
           <path d="M12 12v-2m0 8v-2m-4-2H6m12 0h-2m-3.34-5.66-1.42-1.42m8.48 8.48-1.42-1.42M6.34 6.34 4.93 4.93m14.14 14.14-1.42-1.42" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
} 