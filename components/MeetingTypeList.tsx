'use client'

import { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { toast } from "sonner"

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();

  const createMeeting = async () => {
    try {
      const id = crypto.randomUUID();
      toast("Meeting Created");
      router.push(`/meeting/${id}`);
    } catch (error) {
      console.log(error);
      toast("Failed to create meeting");
    }
  }

  return (
    <section className='grid grid-cols-1 gap-y-3 gap-x-2 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard 
        img='/icons/add-meeting.svg'
        title='New Meeting'
        description='Start an instant meeting'
        handleClick={() => setMeetingState('isInstantMeeting')}
        className="bg-orange-1"
      />
      <HomeCard 
        img='/icons/schedule.svg'
        title='Schedule Meeting'
        description='Plan your meeting'
        handleClick={() => setMeetingState('isScheduleMeeting')}
        className="bg-blue-1"
      />
      <HomeCard 
        img='/icons/recordings.svg'
        title='View Recordings'
        description='Check out your recordings'
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className="bg-purple-1"
      />
      <HomeCard 
        img='/icons/join-meeting.svg'
        title='Join Meeting'
        description='Via invitation link'
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className="bg-yellow-1"
      />
      <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList