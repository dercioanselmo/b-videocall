'use client'

import { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner"

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();

  // If you want to store scheduled meeting info, you can add backend logic here
  // For Agora, just generate a channel ID (UUID) and route to meeting/[id]

  const createMeeting = async () => {
    try {
      // Generate unique channel ID
      const id = crypto.randomUUID();

      toast("Meeting Created");

      // Redirect to the meeting setup/join page
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
      {/* You can add more MeetingModal components for schedule/join if you implement those features */}
    </section>
  )
}

export default MeetingTypeList