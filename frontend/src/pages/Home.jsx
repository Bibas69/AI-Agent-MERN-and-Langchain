import React from 'react'
import AssistantPannel from '../components/AssistantPannel'
import TaskCreation from '../components/TaskCreation'
import SmartNotification from '../components/SmartNotification'
import EmptySlots from '../components/EmptySlots'
import UpcomingTasks from '../components/UpcomingTasks'
import Summary from '../components/Summary'
import InProgressTask from '../components/InProgressTask'

const Home = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center gap-5 p-4 mt-10'>
      <div className='w-full h-full flex items-center justify-center gap-20 p-4'>
        <div className='flex flex-col gap-6'>
          <AssistantPannel />
          <InProgressTask />
        </div>
        <div className='flex flex-col gap-4'>
          <TaskCreation />
          <SmartNotification />
        </div>
      </div>
      <div className='w-full h-full flex justify-center gap-20 px-4'>
        <div>
          <UpcomingTasks />
        </div>
        <div className='flex gap-10'>
          <EmptySlots/>
          <Summary />
        </div>
      </div>
    </div>
  )
}

export default Home