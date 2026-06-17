'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Plus, Edit3, X, Save, Megaphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

interface Announcement {
  id: string;
  title: string;
  description: string;
  isImportant: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface EventAnnouncementsProps {
  eventId: string;
  isFounder: boolean;
}

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const timeAgo = (dateStr?: string) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const blankForm = { title: '', description: '', isImportant: false };

const EventAnnouncement = ({ eventId, isFounder }: EventAnnouncementsProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // create form
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState(blankForm);

  // edit form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(blankForm);

  const getToken = () => localStorage.getItem('token') ?? '';

  // ── fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!eventId) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/events/getAnn/${eventId}`, {
          headers: { authorization: `Bearer ${getToken()}` },
        });
        const list: Announcement[] =
          res.data?.data ??
          res.data?.announcements ??
          (Array.isArray(res.data) ? res.data : []);
        setAnnouncements(list);
      } catch (err: any) {
        if (err.response?.status !== 404) {
          toast.error('Failed to load announcements');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [eventId]);

  // ── create ─────────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newForm.title.trim() || !newForm.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API}/api/v1/events/announcement/${eventId}`,
        newForm,
        { headers: { authorization: `Bearer ${getToken()}` } }
      );
      const created: Announcement =
        res.data?.data ?? res.data?.announcement ?? { ...newForm, id: Date.now().toString(), createdAt: new Date().toISOString() };
      setAnnouncements((prev) => [created, ...prev]);
      setNewForm(blankForm);
      setIsAdding(false);
      toast.success('Announcement posted');
    } catch (err: any) {
      const msg = err.response?.data?.msg;
      toast.error(msg || 'Failed to post announcement');
    } finally {
      setSubmitting(false);
    }
  };

  // ── start edit ─────────────────────────────────────────────────────────────
  const startEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setEditForm({ title: ann.title, description: ann.description, isImportant: ann.isImportant });
    setIsAdding(false);
  };

  // ── save edit ──────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.put(
        `${API}/api/v1/events/announcement/${eventId}?id=${editingId}`,
        editForm,
        { headers: { authorization: `Bearer ${getToken()}` } }
      );
      const updated: Announcement =
        res.data?.data ?? res.data?.announcement ?? { ...editForm, id: editingId! };
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...updated } : a))
      );
      setEditingId(null);
      toast.success('Announcement updated');
    } catch (err: any) {
      const msg = err.response?.data?.msg;
      toast.error(msg || 'Failed to update announcement');
    } finally {
      setSubmitting(false);
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `${API}/api/v1/events/announcement/${eventId}?id=${id}`,
        { headers: { authorization: `Bearer ${getToken()}` } }
      );
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      toast.success('Announcement deleted');
    } catch (err: any) {
      const msg = err.response?.data?.msg;
      if (err.response?.status === 403) {
        toast.error('Only the club head can delete announcements');
      } else {
        toast.error(msg || 'Failed to delete announcement');
      }
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-yellow-400" />
          Announcements
        </h3>
        {isFounder && !isAdding && (
          <Button
            onClick={() => { setIsAdding(true); setEditingId(null); }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
        )}
      </div>

      {/* create form */}
      {isAdding && (
        <div className="bg-[#111] border border-yellow-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-400">New Announcement</span>
            <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <Input
            placeholder="Title"
            value={newForm.title}
            onChange={(e) => setNewForm((p) => ({ ...p, title: e.target.value }))}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Textarea
            placeholder="Description…"
            rows={3}
            value={newForm.description}
            onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))}
            className="bg-gray-800 border-gray-700 text-white resize-none"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={newForm.isImportant}
                onChange={(e) => setNewForm((p) => ({ ...p, isImportant: e.target.checked }))}
                className="rounded border-gray-600 bg-gray-800 text-yellow-400"
              />
              Mark as important
            </label>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAdding(false)}
                disabled={submitting}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={submitting}
                className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Post
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* list */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 py-6">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading announcements…</span>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-10">
          <Megaphone className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-400 text-sm">
            {isFounder ? 'No announcements yet. Add one above!' : 'No announcements yet. Check back later.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) =>
            editingId === ann.id ? (
              // inline edit form
              <div key={ann.id} className="bg-[#111] border border-yellow-500/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-yellow-400">Edit Announcement</span>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  placeholder="Title"
                  value={editForm.title}
                  onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Textarea
                  placeholder="Description…"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isImportant}
                      onChange={(e) => setEditForm((p) => ({ ...p, isImportant: e.target.checked }))}
                      className="rounded border-gray-600 bg-gray-800 text-yellow-400"
                    />
                    Important
                  </label>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingId(null)}
                      disabled={submitting}
                      className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      disabled={submitting}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // announcement card
              <div
                key={ann.id}
                className="group bg-[#0d0d0d] border border-gray-800 hover:border-yellow-500/30 rounded-xl p-5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-white">{ann.title}</h4>
                    {ann.isImportant && (
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-2 py-0">
                        Important
                      </Badge>
                    )}
                  </div>
                  {isFounder && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => startEdit(ann)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Delete"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{ann.description}</p>
                {ann.createdAt && (
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{timeAgo(ann.createdAt)}</span>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default EventAnnouncement;
