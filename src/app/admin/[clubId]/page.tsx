'use client';

import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


export default function ClubAdminPage() {
  const params = useParams();
  const { clubId } = params;

  //club data state
  const [clubData, setClubData] = useState({});

  //update social media links for the club
  const [instagram, setInstagramLink] = useState('');
  const [linkedin, setLinkedinLink] =useState('');
  const [twitter, setTwitterLink] = useState('');

  //removing members state
  const [removeMemberId, setRemoveMemberId] = useState('');

  //adding core members state
  const [coreMember1, setCoreMember1] = useState('');
  const [coreMember2, setCoreMember2] = useState('');
  const [coreMember3, setCoreMember3] = useState('');

  //transferring ownership state
  const [newOwnerEmail, setNewOwnerEmail] = useState('');

  //remove core members state
  const [removeCoreMember1, setRemoveCoreMembe1] = useState('');
  const [removeCoreMember2, setRemoveCoreMember2] = useState('');
  const [removeCoreMember3, setRemoveCoreMember3] = useState('');

   // wings state
   const [wings, setWings] = useState([]);

   // events state
    const [event, setEvent] = useState({});
    const [eventId, setEventId] = useState('');

    // event links state
    const [link1, setLink1] = useState('');
    const [link2, setLink2] = useState('');
    const [link3, setLink3] = useState('');

    const fetchClubData = async () => {
      try {
        const fetch = await axios.get<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/${clubId}`);
        setEvent(fetch.data.club.events);
        setClubData(fetch.data.club);
        setCoreMember1(fetch.data.club.coremember1);
        setCoreMember2(fetch.data.club.coremember2);
        setCoreMember3(fetch.data.club.coremember3);
        setInstagramLink(fetch.data.club.instagram);
        setLinkedinLink(fetch.data.club.linkedin);
        setTwitterLink(fetch.data.club.twitter);
        toast(fetch.data.msg);
      } catch (error) {
        alert('Error fetching club data');
      }
    }

    const updateClubLinks = async () => {

    }
  return (
    <div>
      <h1>Club Admin Page</h1>
      {/* Add your admin page content here */}
      
    </div>
  );
}