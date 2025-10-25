"use client"
import React, { useState } from 'react';
import { Users, Calendar, Bell, Link, UserPlus, UserMinus, Trash2, ArrowRightLeft, MessageSquare, Plus, Edit, X } from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('clubs');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
  };

  const renderClubManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Club Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActionCard
          icon={<Link className="w-6 h-6" />}
          title="Update Club Links"
          description="Manage social media and external links"
          onClick={() => openModal('updateLinks')}
        />
        <ActionCard
          icon={<Plus className="w-6 h-6" />}
          title="Add Wings"
          description="Create new club wings or departments"
          onClick={() => openModal('addWings')}
        />
        <ActionCard
          icon={<UserPlus className="w-6 h-6" />}
          title="Add Core Members"
          description="Assign core team positions"
          onClick={() => openModal('addCore')}
        />
        <ActionCard
          icon={<UserMinus className="w-6 h-6" />}
          title="Remove Members"
          description="Remove club members"
          onClick={() => openModal('removeMember')}
        />
        <ActionCard
          icon={<UserMinus className="w-6 h-6" />}
          title="Remove Core Members"
          description="Remove core team members"
          onClick={() => openModal('removeCore')}
        />
        <ActionCard
          icon={<ArrowRightLeft className="w-6 h-6" />}
          title="Transfer Ownership"
          description="Transfer club ownership rights"
          onClick={() => openModal('transfer')}
        />
      </div>
    </div>
  );

  const renderEventManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Event Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionCard
          icon={<Trash2 className="w-6 h-6" />}
          title="Delete Event"
          description="Permanently remove an event"
          onClick={() => openModal('deleteEvent')}
          danger
        />
        <ActionCard
          icon={<Link className="w-6 h-6" />}
          title="Update Event Links"
          description="Manage event registration and info links"
          onClick={() => openModal('updateEventLinks')}
        />
      </div>
    </div>
  );

  const renderClubAnnouncements = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Club Announcements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          icon={<Plus className="w-6 h-6" />}
          title="Create Announcement"
          description="Post new club announcement"
          onClick={() => openModal('createClubAnn')}
        />
        <ActionCard
          icon={<Edit className="w-6 h-6" />}
          title="Update Announcement"
          description="Edit existing announcements"
          onClick={() => openModal('updateClubAnn')}
        />
        <ActionCard
          icon={<Trash2 className="w-6 h-6" />}
          title="Delete Announcement"
          description="Remove club announcements"
          onClick={() => openModal('deleteClubAnn')}
          danger
        />
      </div>
    </div>
  );

  const renderEventAnnouncements = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Event Announcements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          icon={<Plus className="w-6 h-6" />}
          title="Create Announcement"
          description="Post new event announcement"
          onClick={() => openModal('createEventAnn')}
        />
        <ActionCard
          icon={<Edit className="w-6 h-6" />}
          title="Update Announcement"
          description="Edit existing announcements"
          onClick={() => openModal('updateEventAnn')}
        />
        <ActionCard
          icon={<Trash2 className="w-6 h-6" />}
          title="Delete Announcement"
          description="Remove event announcements"
          onClick={() => openModal('deleteEventAnn')}
          danger
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-black">Admin Control Panel</h1>
          <p className="text-black/80 mt-1">Manage clubs, events, and announcements</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-zinc-900 border-b border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            <TabButton
              icon={<Users className="w-5 h-5" />}
              label="Clubs"
              active={activeTab === 'clubs'}
              onClick={() => setActiveTab('clubs')}
            />
            <TabButton
              icon={<Calendar className="w-5 h-5" />}
              label="Events"
              active={activeTab === 'events'}
              onClick={() => setActiveTab('events')}
            />
            <TabButton
              icon={<Bell className="w-5 h-5" />}
              label="Club Announcements"
              active={activeTab === 'clubAnn'}
              onClick={() => setActiveTab('clubAnn')}
            />
            <TabButton
              icon={<MessageSquare className="w-5 h-5" />}
              label="Event Announcements"
              active={activeTab === 'eventAnn'}
              onClick={() => setActiveTab('eventAnn')}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'clubs' && renderClubManagement()}
        {activeTab === 'events' && renderEventManagement()}
        {activeTab === 'clubAnn' && renderClubAnnouncements()}
        {activeTab === 'eventAnn' && renderEventAnnouncements()}
      </main>

      {/* Modal */}
      {showModal && (
        <Modal type={modalType} onClose={closeModal} />
      )}
    </div>
  );
}

function TabButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
        active
          ? 'border-yellow-500 text-yellow-400'
          : 'border-transparent text-gray-400 hover:text-yellow-400 hover:border-yellow-500/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ActionCard({ icon, title, description, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-lg border-2 transition-all text-left hover:scale-105 ${
        danger
          ? 'bg-red-950/20 border-red-500/30 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20'
          : 'bg-zinc-900 border-yellow-500/30 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20'
      }`}
    >
      <div className={`mb-3 ${danger ? 'text-red-500' : 'text-yellow-400'}`}>
        {icon}
      </div>
      <h3 className={`font-semibold text-lg mb-2 ${danger ? 'text-red-400' : 'text-white'}`}>
        {title}
      </h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </button>
  );
}

function Modal({ type, onClose }) {
  const getModalContent = () => {
    const titles = {
      updateLinks: 'Update Club Links',
      addWings: 'Add Wings',
      addCore: 'Add Core Members',
      removeMember: 'Remove Member',
      removeCore: 'Remove Core Member',
      transfer: 'Transfer Ownership',
      deleteEvent: 'Delete Event',
      updateEventLinks: 'Update Event Links',
      createClubAnn: 'Create Club Announcement',
      updateClubAnn: 'Update Club Announcement',
      deleteClubAnn: 'Delete Club Announcement',
      createEventAnn: 'Create Event Announcement',
      updateEventAnn: 'Update Event Announcement',
      deleteEventAnn: 'Delete Event Announcement',
    };

    return titles[type] || 'Action';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg border-2 border-yellow-500/30 max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-yellow-500/30">
          <h3 className="text-xl font-bold text-yellow-400">{getModalContent()}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Club/Event ID
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 bg-black border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500 text-white"
              placeholder="Enter ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Additional Information
            </label>
            <textarea
              className="w-full px-4 py-2 bg-black border border-yellow-500/30 rounded-lg focus:outline-none focus:border-yellow-500 text-white h-24"
              placeholder="Enter details..."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}