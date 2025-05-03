'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Share, MoreHorizontal, ThumbsUp } from 'lucide-react';
import { mockPosts, getUserById, getTimeAgo, suggestedUsers, interestCategories } from '@/constants/mockposts';
import { users } from '@/constants/mockposts';

export default function Feed() {
  const [activeTab, setActiveTab] = useState<'recents' | 'friends' | 'popular'>('recents');
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Feed Column */}
      <div className="lg:col-span-2">
        {/* Tabs */}
        <div className="bg-gray-900 rounded-lg mb-4 p-1 flex shadow-md">
          <button 
            onClick={() => setActiveTab('recents')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'recents' 
                ? 'bg-yellow-500 text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Recents
          </button>
          <button 
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'friends' 
                ? 'bg-yellow-500 text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Friends
          </button>
          <button 
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === 'popular' 
                ? 'bg-yellow-500 text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Popular
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {mockPosts.map(post => {
            const user = getUserById(post.userId);
            if (!user) return null;
            
            return (
              <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-md border border-gray-800">
                {/* Post Header */}
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{user.name}</h3>
                      <p className="text-xs text-gray-400">{getTimeAgo(post.timestamp)}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white p-1 rounded-full">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                
                {/* Post Content */}
                <div className="px-4 pb-3">
                  <p className="text-gray-200">{post.content}</p>
                </div>
                
                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid ${
                    post.images.length === 1 ? 'grid-cols-1' : 
                    post.images.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2 grid-rows-2'
                  } gap-1 mb-3`}>
                    {post.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`${
                          post.images && post.images.length === 3 && idx === 0 
                            ? 'col-span-2' 
                            : ''
                        } aspect-video overflow-hidden`}
                      >
                        <img 
                          src={img} 
                          alt={`Post image ${idx + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Reactions Bar */}
                {post.reactions && (
                  <div className="px-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center -space-x-1">
                        <div className="bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white border border-gray-900">
                          <ThumbsUp size={10} />
                        </div>
                        {post.reactions.some(r => r.type === 'love') && (
                          <div className="bg-red-500 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white border border-gray-900">
                            ❤️
                          </div>
                        )}
                        {post.reactions.some(r => r.type === 'wow') && (
                          <div className="bg-yellow-500 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white border border-gray-900">
                            😮
                          </div>
                        )}
                        <span className="ml-3 text-xs text-gray-400">
                          {post.likes} reactions
                        </span>
                      </div>
                      
                      <span className="text-xs text-gray-400">
                        {post.comments} comments
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Action Bar */}
                <div className="border-t border-gray-800 px-2">
                  <div className="flex justify-between py-2">
                    <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-gray-400 hover:bg-gray-800 rounded-md flex-1 transition-colors">
                      <Heart size={18} />
                      <span className="text-sm">Like</span>
                    </button>
                    <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-gray-400 hover:bg-gray-800 rounded-md flex-1 transition-colors">
                      <MessageCircle size={18} />
                      <span className="text-sm">Comment</span>
                    </button>
                    <button className="flex items-center justify-center gap-1 px-3 py-1.5 text-gray-400 hover:bg-gray-800 rounded-md flex-1 transition-colors">
                      <Share size={18} />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="hidden lg:block">
        {/* Stories Section */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 shadow-md border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-4">Stories</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative rounded-lg overflow-hidden aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800" 
                alt="Story" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-yellow-500">
                    <img src={users[0].avatar} alt={users[0].name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-xs ml-1 font-medium truncate">{users[0].name}</span>
                </div>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800" 
                alt="Story" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-yellow-500">
                    <img src={users[1].avatar} alt={users[1].name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-white text-xs ml-1 font-medium truncate">{users[1].name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Suggestions */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 shadow-md border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-3">Suggestions</h3>
          <div className="space-y-3">
            {suggestedUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{user.name}</h4>
                  </div>
                </div>
                <button className="px-3 py-1 bg-gray-800 hover:bg-yellow-500 hover:text-black text-gray-200 text-xs font-medium rounded-full transition-colors">
                  Follow
                </button>
              </div>
            ))}
            <button className="text-yellow-500 hover:text-yellow-400 text-sm w-full text-center mt-2">
              See all
            </button>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="bg-gray-900 rounded-lg p-4 shadow-md border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-3">Interests</h3>
          <div className="grid grid-cols-2 gap-2">
            {interestCategories.map(category => (
              <div 
                key={category.id}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex flex-col items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-2xl mb-1">{category.icon}</span>
                <span className="text-white text-sm">{category.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}