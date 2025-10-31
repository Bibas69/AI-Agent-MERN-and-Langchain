import React from 'react'

const TaskCreation = () => {
  return (
    <div className='w-140 h-40 bg-secondary border-[1px] border-zinc-700 rounded-sm shadow-sm shadow-zinc-500'>
        <form method='POST' className='w-full h-full flex flex-col gap-2 p-2'>
            <p className='text-white'>Quick Task Creation</p>
            <div className='w-full h-full flex flex-col items-center justify-center gap-4 select-none'>
                <input type="text" placeholder='Remind me to...' className='placeholder-white w-[90%] h-10 bg-zinc-800 p-2 outline-none text-white rounded-sm border-[1px] border-zinc-500 hover:border-white duration-300' />
                <button type='submit' className='text-white w-[40%] h-10 border-[1px] border-blue-500 rounded-sm hover:bg-blue-700 duration-300'>Create Task</button>
            </div>
        </form>
    </div>
  )
}

export default TaskCreation