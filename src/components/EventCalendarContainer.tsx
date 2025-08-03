import Image from "next/image"
import EventCalendar from "./EventCalendar"
import EventList from "./EventList"

const EventCalendarContainer = async({searchParams}:{searchParams: {[keys: string]:string | undefined}}) => {
  
    const {date} = searchParams 


    return (
    <div className="p-4 bg-white rounded-lg">

      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold my-4">Event</h1>
        <Image src = '/moreDark.png' alt="" width={20} height={20} />
      </div>

      <div className="flex flex-col gap-4">
        <EventList dateParam={date}/>
      </div>
    </div>
  )
}

export default EventCalendarContainer
