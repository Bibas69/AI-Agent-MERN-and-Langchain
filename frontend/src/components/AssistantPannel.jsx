import React from 'react'

const AssistantPannel = () => {
  return (
    <div className='relative w-140 h-50 rounded-md border-[1px] border-zinc-700 overflow-hidden flex items-center justify-center'>
      <div className='absolute w-[200%] h-[200%] bg-red-300 flex items-center justify-center animate-rotate' style={{
      background: "conic-gradient(#00ffcc 0deg, #00ffcc 10deg, #1e293b 180deg)"
      }}></div>
      <div className='relative w-138 h-48 bg-secondary rounded-md border-[1px] border-zinc-700'></div>
    </div>
  )
}

export default AssistantPannel