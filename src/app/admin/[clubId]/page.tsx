'use client';

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import EventTab from "../../../components/eventTab";
import Image from "next/image";

export default function ClubAdminPage() {
  const params = useParams();
  const { clubId } = params;

  const [openMembersModal, setOpenMembersModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [clubData, setClubData] = useState<any>({});
  const [instagram, setInstagramLink] = useState('');
  const [linkedin, setLinkedinLink] = useState('');
  const [twitter, setTwitterLink] = useState('');
  const [removeMemberId, setRemoveMemberId] = useState('');
  const [coremember1, setCoreMember1] = useState('');
  const [coremember2, setCoreMember2] = useState('');
  const [coremember3, setCoreMember3] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [wings, setWings] = useState<any[]>([]);
  const [event, setEvent] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tok = localStorage.getItem('token');
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

  useEffect(() => setIsClient(true), []);

  const fetchClubData = async () => {
    if (!clubId || !isClient || !token) return;
    try {
      const fetch = await axios.get<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/clubs/${clubId}`, { 
        headers: { authorization: `Bearer ${token}` }
      });
      setEvent(fetch.data.club.events);
      setClubData(fetch.data.club);
      setCoreMember1(fetch.data.club.coremember1);
      setCoreMember2(fetch.data.club.coremember2);
      setCoreMember3(fetch.data.club.coremember3);
      setInstagramLink(fetch.data.club.instagram);
      setLinkedinLink(fetch.data.club.linkedin);
      setTwitterLink(fetch.data.club.twitter);
      toast(fetch.data.msg);
    } catch {
      alert('Error fetching club data');
    }
  };

  const updateClubLinks = async () => {
    try {
      const res = await axios.put<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/updateClubLinks/${clubId}`,
        { instagram, twitter, linkedin },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast(res.data.msg);
    } catch {
      alert('Error updating club links');
    }
  };

  const addCoreMembers = async () => {
    try {
      const res = await axios.post<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/addCoreMembers/${clubId}`,
        { coremember1, coremember2, coremember3 },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast(res.data.msg);
    } catch {
      alert('Error adding core members');
    }
  };

  const addWings = async () => {
    try {
      const res = await axios.put<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/addWings/${clubId}`,
        { wings },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast(res.data.msg);
    } catch {
      alert('Error adding wings');
    }
  };

  const removeMember = async () => {
    try {
      const res = await axios.post<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/removeMember/${clubId}`,
        { member: removeMemberId },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast(res.data.msg);
    } catch {
      alert('Error removing member');
    }
  };

  const transferOwnership = async () => {
    try {
      const res = await axios.put<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/transferOwnership/${clubId}`,
        { newOwnerEmail },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast(res.data.msg);
    } catch {
      alert('Error transferring ownership');
    }
  };

  const removeCoreMembers = async () => {
    try {
      const res = await axios.post<any>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/admin/removeCoremembers/${clubId}`,
        { coremember1, coremember2, coremember3 },
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast(res.data.msg);
    } catch {
      alert('Error removing core members');
    }
  };

  useEffect(() => {
    if (!isClient || !token || !clubId) return;
    setLoading(true);
    fetchClubData();
    setLoading(false);
  }, [token, isClient, clubId]);

  if (loading) return <div className="p-6 text-yellow-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-yellow-400 font-[Inter] p-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold tracking-tight text-yellow-300">⚡ Club Admin Dashboard</h1>

        {clubData && clubData.name && (
          <div className="space-y-10">
            <section className="bg-zinc-900 border border-yellow-400/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,215,0,0.1)]">
              <h2 className="text-2xl font-semibold mb-4 text-yellow-300">{clubData.name}</h2>
              <div className="space-y-4">
                {['instagram', 'twitter', 'linkedin'].map((social) => (
                  <div key={social}>
                    <h3 className="capitalize text-sm tracking-wide text-yellow-300/80">
                      {social}
                    </h3>
                    <input
                      className="w-full mt-1 bg-black text-yellow-400 border border-yellow-500/40 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/60"
                      placeholder={`New ${social} link`}
                      onChange={(e) =>
                        social === 'instagram'
                          ? setInstagramLink(e.target.value)
                          : social === 'twitter'
                          ? setTwitterLink(e.target.value)
                          : setLinkedinLink(e.target.value)
                      }
                    />
                  </div>
                ))}
                <button
                  onClick={updateClubLinks}
                  className="mt-3 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-all"
                >
                  Update Links
                </button>
              </div>
            </section>

            <section className="bg-zinc-900 border border-yellow-400/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-yellow-300">Core Members</h2>
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex flex-col gap-2 border-b border-yellow-400/20 pb-4 mb-4">
                  <span>
                    Core Member {num}:{" "}
                    <span className="text-yellow-200">
                      {clubData[`coremember${num}`] ?? '—'}
                    </span>
                  </span>
                  <input
                    type="text"
                    placeholder={`Update Core Member ${num} Email`}
                    className="bg-black border border-yellow-500/40 text-yellow-400 p-2 rounded-lg"
                    onChange={(e) =>
                      num === 1
                        ? setCoreMember1(e.target.value)
                        : num === 2
                        ? setCoreMember2(e.target.value)
                        : setCoreMember3(e.target.value)
                    }
                  />
                  <button
                    onClick={removeCoreMembers}
                    className="text-xs text-red-400 hover:text-red-300 w-fit"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addCoreMembers}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 font-semibold"
              >
                Add Core Members
              </button>
            </section>

            <section className="bg-zinc-900 border border-yellow-400/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3 text-yellow-300">Wings</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add Wing"
                  className="flex-1 bg-black border border-yellow-500/40 text-yellow-400 p-2 rounded-lg"
                  onChange={(e) => setWings([...wings, e.target.value])}
                />
                <button
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 font-semibold"
                  onClick={addWings}
                >
                  Add
                </button>
              </div>
            </section>

            <section className="bg-zinc-900 border border-yellow-400/30 rounded-2xl p-6">
              <button
                onClick={() => setOpenMembersModal(true)}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 font-semibold"
              >
                View Members
              </button>

              {openMembersModal && (
                <div className="mt-6 border-t border-yellow-400/20 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-yellow-300">Members</h2>
                    <button
                      onClick={() => setOpenMembersModal(false)}
                      className="text-sm text-yellow-400/80 hover:text-yellow-300"
                    >
                      Close
                    </button>
                  </div>

                  {clubData.members?.map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-black border border-yellow-400/20 p-3 rounded-xl"
                    >
                      <div className="flex items-center gap-3">

                      <Image
                        src={member.profileAvatar || '/default-avatar.png'}
                        alt="Avatar"
                        width={80}
                        height={80}
                      />

                        <p>{member.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setRemoveMemberId(member.id);
                          removeMember();
                        }}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-zinc-900 border border-yellow-400/30 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-3 text-yellow-300">Transfer Ownership</h2>
              <input
                type="text"
                placeholder="New Owner Email"
                className="w-full bg-black border border-yellow-500/40 text-yellow-400 p-2 rounded-lg mb-3"
                onChange={(e) => setNewOwnerEmail(e.target.value)}
              />
              <button
                onClick={transferOwnership}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 font-semibold"
              >
                Transfer
              </button>
            </section>
          </div>
        )}

        <div className="bg-zinc-900 border border-yellow-400/30 rounded-2xl p-6">
          <EventTab events={event} token={token} />
        </div>
      </div>
    </div>
  );
}
