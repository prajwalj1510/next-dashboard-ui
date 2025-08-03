import Announcement from '@/components/Announcement'
import AttendanceChartCointainer from '@/components/AttendanceChartCointainer'
import CountChartCointainer from '@/components/countChartCointainer'
import EventCalendar from '@/components/EventCalendar'
import EventCalendarContainer from '@/components/EventCalendarContainer'
import FinanceChart from '@/components/FinanceChart'
import UserCard from '@/components/UserCard'
import React from 'react'

const AdminPage = ({searchParams}:{searchParams: {[keys: string]: string | undefined}}) => {
  return (
    <div className='p-4 flex flex-col gap-4 md:flex-row'>
      {/* Left */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        {/* User Card */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type='admin' />
          <UserCard type='teacher' />
          <UserCard type='student' />
          <UserCard type='parent' />
          
        </div>

        {/* Middel Chart */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          {/* Count Chart */}
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChartCointainer />
          </div>

          {/* Attendance Chart */}
          <div className='w-full lg:w-2/3 h-[450px]'>
            <AttendanceChartCointainer />
          </div>
        </div>

        {/* Bottom Chart */}
        <div className='w-full h-[500px]'>
          <FinanceChart />
        </div>

      </div>


      {/* Right */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalendarContainer searchParams={searchParams}/>
        <Announcement />
      </div>
    </div>
  )
}

export default AdminPage
