"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function EventTab({ token, events }: { token: string; events: any[] }) {
  if (!token || !events) {
    return <div className="text-yellow-400 text-center mt-4">Please log in to view this content.</div>;
  }

  if (events.length === 0) {
    return <div className="text-yellow-400 text-center mt-4">No events available.</div>;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>("");
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [link1, setLink1] = useState("");
  const [link2, setLink2] = useState("");
  const [link3, setLink3] = useState("");
  const [openEventModal, setOpenEventModal] = useState<boolean>(false);

  const EventModal = async (id: string) => {
    try {
      const eventRes = await axios.get<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events/event/${id}`);
      setEventDetails(eventRes.data.response);
      setOpenEventModal(true);
    } catch (error) {
      toast.error("Error fetching event details");
    }
  };

  const updateLinks = async (id: string) => {
    try {
      const updateLinks = await axios.put<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/updateEventLinks/${id}`,
        { link1, link2, link3 },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast(updateLinks.data.msg);
    } catch (error) {
      toast.error("Error updating event links");
    }
  };

  const deleteEvent = async () => {
    try {
      const deleteEv = await axios.post<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/deleteEvent/${eventId}`,
        {},
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast(deleteEv.data.msg);
      setEventId("");
    } catch (error) {
      toast.error("Error deleting event");
    }
  };

  return (
    <div className="bg-black text-yellow-400 min-h-screen p-6 font-mono">
      <h2 className="text-2xl font-bold mb-6 border-b border-yellow-500 pb-2">🗓 Events Checklist</h2>

      <div className="space-y-4">
        {events.map((eventItem: any) => (
          <div
            key={eventItem.id}
            className="border border-yellow-600 rounded-2xl p-4 flex items-center justify-between bg-[#0a0a0a] hover:bg-[#111] transition-all"
          >
            <p className="text-lg font-semibold">{eventItem.EventName}</p>
            <div className="space-x-3">
              <button
                onClick={() => {
                  setEventId(eventItem.id);
                  deleteEvent();
                }}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => EventModal(eventItem.id)}
                className="border border-yellow-500 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-all"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {openEventModal && eventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#0a0a0a] border border-yellow-500 rounded-2xl p-6 w-[90%] max-w-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{eventDetails.EventName}</h2>
              <button
                onClick={() => {
                  setOpenEventModal(false);
                  setEventId("");
                }}
                className="text-yellow-400 hover:text-yellow-300 text-2xl"
              >
                ✕
              </button>
            </div>
            <p className="mb-2"><strong>Description:</strong> {eventDetails.description}</p>
            <p className="mb-4"><strong>Date:</strong> {new Date(eventDetails.startDate).toLocaleDateString()}</p>

            <div className="space-y-3">
              <div>
                <h3>Link 1: {eventDetails.link1}</h3>
                <input
                  type="text"
                  placeholder="New Link 1"
                  onChange={(e) => setLink1(e.target.value)}
                  className="w-full p-2 rounded bg-black border border-yellow-500 text-yellow-400 mt-1"
                />
              </div>
              <div>
                <h3>Link 2: {eventDetails.link2}</h3>
                <input
                  type="text"
                  placeholder="New Link 2"
                  onChange={(e) => setLink2(e.target.value)}
                  className="w-full p-2 rounded bg-black border border-yellow-500 text-yellow-400 mt-1"
                />
              </div>
              <div>
                <h3>Link 3: {eventDetails.link3}</h3>
                <input
                  type="text"
                  placeholder="New Link 3"
                  onChange={(e) => setLink3(e.target.value)}
                  className="w-full p-2 rounded bg-black border border-yellow-500 text-yellow-400 mt-1"
                />
              </div>
              <button
                onClick={() => updateLinks(eventDetails.id)}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all mt-3 w-full"
              >
                Update Links
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
