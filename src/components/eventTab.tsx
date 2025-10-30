"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function EventTab ({token, events}: {token : string, events : any}){
   if (!token) {
    return <div>Please log in to view this content.</div>;
  }

    const [eventId, setEventId] = useState<string>('');
    const [eventDetails, setEventDetails] = useState<any>(null);
    const [link1, setLink1] = useState('');
    const [link2, setLink2] = useState('');
    const [link3, setLink3] = useState('');

  
    const [openEventModal, setOpenEventModal] = useState<boolean>(false);

    const   EventModal = async (id : string) => {
        try {       

            const eventRes = await axios.get<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event/${id}`, { headers : {
            } });
            setEventDetails(eventRes.data.response);
            setOpenEventModal(true);
        } catch (error) {
            alert('Error fetching event details');
        }
    }

    const updateLinks = async (id : string) => {
      try {
        const updateLinks = await axios.put<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/updateEventLinks/${id}`, {
         link1,
         link2,
         link3
        }, { headers : {
          authorization: `Bearer ${token}`
        }
        });
        toast(updateLinks.data.msg);
      } catch (error) {
        alert('Error updating club links');
      }
    }

    const deleteEvent = async () => {
      try {
        const deleteEv = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/deleteEvent/${eventId}`, {}, { headers : {
          authorization: `Bearer ${token}`
        }
        });
        toast(deleteEv.data.msg);
        setEventId('');
      } catch (error) {
        alert('Error deleting event');
      }
    }

  return <div>
     
          <div>
            <h2>Events checklist</h2>

            {events.map((eventItem : any) => (
              <div key={eventItem.id}>
                <p>{eventItem.EventName}</p>
                <button
                onClick={()=> {
                  setEventId(eventItem.id)
                  deleteEvent();
                }}
                >Delete</button>
                <button 
                onClick={() => {
                  EventModal(eventItem.id)
                }}
                >Check Event details</button>
             </div>
             
            )
            
            )} 

{openEventModal && eventDetails && ( 
    <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => {setOpenEventModal(false)
        setEventId('');
      }}>&times;</span>
      <h2>{eventDetails.EventName}</h2>
      <p><strong>Description:</strong> {eventDetails.description}</p>
      <p><strong>Date:</strong> {new Date(eventDetails.startDate).toLocaleDateString()}</p>
      <p><strong>Links:</strong></p>
      <ul>
        <h3>link 1 : {eventDetails.link1}</h3> 
        <input type="text" placeholder="New Instagram Link" onChange={(e : any) => setLink1(e.target.value)} />
        <h3>link 2 : {eventDetails.link2}</h3> 
        <input type="text" placeholder="New Twitter Link" onChange={(e : any) => setLink2(e.target.value)} />
        <h3>link 3 : {eventDetails.link3}</h3> 
        <input type="text" placeholder="New Linkedin Link" onChange={(e : any) => setLink3(e.target.value)} />
        <button onClick={()=>{
            updateLinks(eventDetails.id);
        }}>Update Club Links</button>
      </ul>
    </div>      
    </div>
) }
        </div>
        
    </div>;
}