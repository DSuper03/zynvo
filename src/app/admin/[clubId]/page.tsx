'use client';

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EventTab from "../../../components/eventTab";


export default function ClubAdminPage() {
  const params = useParams();
  const { clubId } = params;

  const [openMembersModal, setOpenMembersModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  //club data state
  const [clubData, setClubData] = useState<any>({});

  //update social media links for the club
  const [instagram, setInstagramLink] = useState('');
  const [linkedin, setLinkedinLink] = useState('');
  const [twitter, setTwitterLink] = useState('');

  //removing members state
  const [removeMemberId, setRemoveMemberId] = useState('');

  //adding core members state
  const [coremember1, setCoreMember1] = useState('');
  const [coremember2, setCoreMember2] = useState('');
  const [coremember3, setCoreMember3] = useState('');

  //transferring ownership state
  const [newOwnerEmail, setNewOwnerEmail] = useState('');

   // wings state
   const [wings, setWings] = useState<any[]>([]);

   // events state
    const [event, setEvent] = useState<any[]>([]);

  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useRouter();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token')
      if (tok) setToken(tok);
      else {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => navigate.push('/auth/signin'),
          },
        });
        return;
      }


      if (sessionStorage.getItem('activeSession') != 'true') {
         toast('Login required', {
          action: {
            label: 'Sign in',
            onClick: () => navigate.push('/auth/signin'),
          },
        });
        return;
      }
    }
  }, [navigate]);


  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchClubData = async () => {
    if (!clubId || !isClient || !token) return;
    
    try {
      const fetch = await axios.get<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/${clubId}`, { 
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      console.log('Club Data:', fetch.data);

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
    try {
      const updateLinks = await axios.put<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/updateClubLinks/${clubId}`, {
        instagram,
        twitter,
        linkedin
      }, { 
        headers: {
          authorization: `Bearer ${token}`
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
        coremember1,
        coremember2,
        coremember3
      }, { 
        headers: {
          authorization: `Bearer ${token}`
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
      }, { 
        headers: {
          authorization: `Bearer ${token}`
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
        member : removeMemberId
      }, { 
        headers: {
          authorization: `Bearer ${token}`
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
      }, { 
        headers: {
          authorization: `Bearer ${token}`
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
        coremember1,
        coremember2,
        coremember3
      }, { 
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      toast(removeCore.data.msg);
    } catch (error) {
      alert('Error removing core members');
    }
  } 

  useEffect(() => {
    if (!isClient || !token || !clubId) return;
    setLoading(true);
    fetchClubData();
    setLoading(false);
  }, [token, isClient, clubId]);

if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Club Admin Page</h1>
      {/* Add your admin page content here */}
      {
        clubData && clubData.name && (
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

            {openMembersModal && clubData.members && (
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
          </div>
        )
      }

      <EventTab events={event} token={token} />
    </div>
  );
}