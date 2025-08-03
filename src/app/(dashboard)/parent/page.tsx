import Announcement from '@/components/Announcement'
import BigCalendar from '@/components/BigCalendar'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import { getUserRole } from '@/lib/getUserRole'
import prisma from '@/lib/prisma'
import React from 'react'

const { userId } = getUserRole()

const ParentPage = async () => {

  const students = await prisma.student.findMany({
    where: {
      parentId: userId!,
    }
  })

  return (
    <div className='flex-1 p-4 flex gap-4 flex-col xl:flex-row'>
      {/* Left */}
      <div className=''>
        {students.map((student) => (
          <div className='w-full xl:w-2/3'>
            <div className='h-full bg-white p-4 rounded-md'>
              <h1 className='text-xl font-semibold'>Schedule ({student.name + " " + student.surname})</h1>
              <BigCalendarContainer type='classId' id={student.classId} />
            </div>
          </div>
        ))}
      </div>

      {/* Right */}
      <div className='w-full xl:w-1/3 flex-col gap-8'>
        <Announcement />
      </div>
    </div>
  )
}

export default ParentPage
