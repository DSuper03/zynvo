'use client';

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export default function ClubAdminPage() {
  const params = useParams();
  const { clubId } = params;

  const [openMembersModal, setOpenMembersModal] = useState<boolean>(false);
  const [openEventModal, setOpenEventModal] = useState<boolean>(false);

  //club data state
  const [clubData, setClubData] = useState<any>({});

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
   const [wings, setWings] = useState<any[]>([]);

   // events state
    const [event, setEvent] = useState({});
    const [eventId, setEventId] = useState('');

    // event links state
    const [link1, setLink1] = useState('');
    const [link2, setLink2] = useState('');
    const [link3, setLink3] = useState('');

    const fetchClubData = async () => {
      try {
        const fetch = await axios.get<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/clubs/${clubId}`);
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

    const deleteEvent = async () => {
      try {
        const deleteEv = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/deleteEvent/${eventId}`, {}, { headers : {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        toast(deleteEv.data.msg);
      } catch (error) {
        alert('Error deleting event');
      }
    }
    const updateClubLinks = async () => {
      try {
        const updateLinks = await axios.put<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/updateClubLinks/${clubId}`, {
          instagram,
          twitter,
          linkedin
        }, { headers : {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        toast(updateLinks.data.msg);
      } catch (error) {
        alert('Error updating club links');
      }
    }

    const addCoreMembers = async () => {
      try {
        const addCore = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/addCoreMembers/${clubId}`, {
          coreMember1,
          coreMember2,
          coreMember3
        }, { headers : {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        toast(addCore.data.msg);
      } catch (error) {
        alert('Error adding core members');
      }
    }

    const addWings = async () => {
      try {
        const addWing = await axios.put<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/addWings/${clubId}`, {
          wings
        }, { headers : {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        toast(addWing.data.msg);
      } catch (error) {
        alert('Error adding wings');
      }
    }   
  const removeMember = async () => {
    try {
      const removeMem = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/removeMember/${clubId}`, {
        removeMemberId
      }, { headers : {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
      });
      toast(removeMem.data.msg);
    }
    catch (error) {
      alert('Error removing member');
    }
  }
  
  const transferOwnership = async () => {     
    try {
      const transferOwn = await axios.put<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/transferOwnership/${clubId}`, {
        newOwnerEmail
      }, { headers : {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
      });
      toast(transferOwn.data.msg);
    } catch (error) {
      alert('Error transferring ownership');
    }
  }
  
  const removeCoreMembers = async () => { 

    try {
      const removeCore = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/removeCoremembers/${clubId}`, {
        removeCoreMember1,
        removeCoreMember2,
        removeCoreMember3
      }, { headers : {
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
      });
      toast(removeCore.data.msg);
    } catch (error) {
      alert('Error removing core members');
    }
  } 

  useEffect(() => {
    fetchClubData();
  }, []);

  return (
    <div>
      <h1>Club Admin Page</h1>
      {/* Add your admin page content here */}
    {
      clubData ?? (
        <div>
        <h2>Club Name: {clubData.name}</h2>
        <h3>Instagram link : {clubData.instagram}</h3> 
        <input type="text" placeholder="New Instagram Link" onChange={(e : any) => setInstagramLink(e.target.value)} />
        <h3>Twitter link : {clubData.twitter}</h3> 
        <input type="text" placeholder="New Twitter Link" onChange={(e : any) => setTwitterLink(e.target.value)} />
        <h3>Linkedin link : {clubData.linkedin}</h3> 
        <input type="text" placeholder="New Linkedin Link" onChange={(e : any) => setLinkedinLink(e.target.value)} />
        <button onClick={updateClubLinks}>Update Club Links</button>

        <h2>Core Members</h2>
        <h3>Core Member 1 : {clubData.coremember1 ?? clubData.coremember1}</h3>
        <button
        onClick={()=> {
          removeCoreMembers();
        }}
        >remove</button>
        <input type="text" placeholder="update Core Member 1 Email" onChange={(e : any) => setCoreMember1(e.target.value)} />
        <h3>Core Member 2 : {clubData.coremember2 ?? clubData.coremember2}</h3>
        <button
        onClick={()=> {
          removeCoreMembers();
        }}
        >remove</button>
        <input type="text" placeholder="update Core Member 2 Email" onChange={(e : any) => setCoreMember2(e.target.value)} />
        <h3>Core Member 3 : {clubData.coremember3 ?? clubData.coremember3}</h3>
        <button
        onClick={()=> {
          removeCoreMembers();
        }}
        >remove</button>
        <input type="text" placeholder="update Core Member 3 Email" onChange={(e : any) => setCoreMember3(e.target.value)} />
        <button onClick={addCoreMembers}>Add Core Members</button>

        <h2>Wings</h2>
        <input type="text" placeholder="Add Wing" onChange={(e : any) => setWings([...wings, e.target.value])} />
        <button onClick={addWings}>Add Wings</button>

        <button onClick={()=> {
          setOpenMembersModal(true)
        }}>
          View Members</button>

        {openMembersModal && (
  <div>
    <h2>Members Modal</h2>
    <button onClick={() => setOpenMembersModal(false)}>Close</button>

    {clubData.members.map((member : any) => (
      <div key={member.id}>
        <p>{member.email}</p>
        <img src={member.profileAvatar} alt="pfp" />
        <button onClick={() => {
          setRemoveMemberId(member.id);
          removeMember();
        }}>
          Remove Member
        </button>
      </div>
    ))}
  </div>
)}

        <h2>Transfer Ownership</h2>
        <input type="text" placeholder="New Owner Email" onChange={(e : any) => setNewOwnerEmail(e.target.value)} />
        <button onClick={transferOwnership}>Transfer Ownership</button>

{/* { event section here , make it tab switching type on the top } */}
        <button
        onClick={() => {
          setOpenEventModal(true)
        }}
        >Check Events</button>

        {openEventModal && (
          <div>
            <h2>Events Modal</h2>
            <button onClick={() => setOpenEventModal(false)}>Close</button>

            {clubData.events.map((eventItem : any) => (
              <div key={eventItem.id}>
                <p>{eventItem.EventName}</p>
                <button
                onClick={()=> {
                  setEventId(eventItem.id)
                  deleteEvent();
                }}
                >Delete</button>
             </div>
             
            )
            
            )} 

        </div>
        )}

        </div>
      )
    }
    </div>
  );
}