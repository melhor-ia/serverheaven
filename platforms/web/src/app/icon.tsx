import { ImageResponse } from 'next/og'
import { CloudCog } from 'lucide-react'

export const runtime = 'edge'

const size = {
  width: 32,
  height: 32,
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #10B981, #059669)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <CloudCog color="white" size={20} />
      </div>
    ),
    size
  )
} 