import React, { useState } from 'react';
import { useAuthUser } from '../features/auth/hooks/useAuthUser';

function ChatBotInterface() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { user } = useAuthUser();


    const initialMessages = [
    {
      id: 1,
      sender: 'user',
      text: 'What are the services provided by EventZen?'
    },
    {
      id: 2,
      sender: 'bot',
      text: (
        <>
          <p className="mb-2">Sure, here are the sentences for each point:</p>
          <ol className="list-decimal pl-4 space-y-1 text-[#6B7280]">
            <li><strong className="font-medium text-[#4B5563]">AI Support For Event Planning:</strong> Our advanced AI tools assist planners in organizing seamless events by providing intelligent recommendations and automating routine tasks.</li>
            <li><strong className="font-medium text-[#4B5563]">Budget Planning Support:</strong> We offer comprehensive budget planning tools to help you manage your event expenses efficiently and stay within your financial limits.</li>
            <li><strong className="font-medium text-[#4B5563]">Virtual Event Support:</strong> Our platform enables you to host engaging virtual events with robust features for live streaming, interactive sessions, and attendee management.</li>
          </ol>
          <p className="mt-2">Would you like any further details or modifications?</p>
        </>
      )
    },
    {
      id: 3,
      sender: 'user',
      text: 'Thank You :)'
    }
  ];

  const [messages, setMessages] = useState(initialMessages);


  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-[#050B1B] flex items-center justify-center p-8 font-sans">
      
      {/* Main Container */}
      <div className="flex w-full max-w-6xl h-[90vh] bg-[#9CA3AF] rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl">
        
        {/* Left Sidebar */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-[#0A0F1D] relative z-0 ${isSidebarOpen ? 'w-[340px]' : 'w-0'}`}>
          <div className="w-[340px] h-full p-6 flex flex-col relative z-10">
            {/* Hamburger (Close) */}
            <div className="flex justify-end mb-8">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2.5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition"
                aria-label="Close sidebar"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* New Chat Button */}
            <button 
              onClick={handleNewChat}
              className="flex items-center gap-4 p-4 bg-[#111625] border border-white/10 rounded-xl mb-4 text-white hover:bg-white/5 transition"
            >
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span className="text-[15px] font-medium">New Chat</span>
            </button>

            {/* Recent Chats Dropdown */}
            <button className="flex items-center gap-4 p-4 bg-[#111625] border border-white/10 rounded-xl mb-4 text-white/70 hover:bg-white/5 transition w-full">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <span className="text-[15px] font-medium">Recent Chats</span>
            </button>

            {/* Chat History */}
            <div className="flex flex-col gap-3 overflow-y-auto mb-4">
              <div className="p-4 bg-[#111625] border border-white/5 rounded-xl text-white/80 text-[14px] leading-snug cursor-pointer hover:bg-white/5 transition">How to reduce the budget?</div>
              <div className="p-4 border border-transparent hover:border-white/5 hover:bg-[#111625] rounded-xl text-white/60 text-[14px] cursor-pointer transition">How to organize an event</div>
              <div className="p-4 border border-transparent hover:border-white/5 hover:bg-[#111625] rounded-xl text-white/60 text-[14px] cursor-pointer transition">What is the minimum price for music and light?</div>
            </div>

            {/* User Profile */}
            <div className="mt-auto bg-white rounded-xl p-3 flex items-center justify-between shadow-lg cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-200 rounded-md overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=fbd38d" alt="User" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-medium tracking-wide">Welcome back,</p>
                  <p className="text-[14px] font-bold text-gray-900 leading-tight">{user?.name || 'Guest'}</p>
                </div>
              </div>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Main Chat Area */}
        <div className="flex-1 flex flex-col px-8 py-6 relative overflow-hidden">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              {!isSidebarOpen && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 border border-white/40 bg-white/20 rounded-lg text-[#2B3A67] hover:bg-white/40 transition mr-4"
                  aria-label="Open sidebar"
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>

            <div className="flex items-center gap-5 ml-auto">
              <button className="text-[#E06A4F] hover:opacity-80 transition">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </button>
              <button 
                onClick={handleNewChat}
                className="text-[#2B3A67] hover:opacity-80 transition"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
              <div className="relative hidden sm:block">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="Search" className="pl-11 pr-4 py-2 w-[280px] rounded-full bg-white shadow-sm outline-none text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 transition" />
              </div>
            </div>
          </div>

          {/* Chat Bubbles */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-8 pr-2">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Start a new conversation...</p>
              </div>
            ) : (
              messages.map((msg) => (
                msg.sender === 'user' ? (
                  /* User Message */
                  <div key={msg.id} className="flex justify-end items-end gap-3">
                    <div className="relative group">
                      <button className="absolute -left-10 top-1/2 -translate-y-1/2 text-gray-600 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                      <div className="bg-white px-6 py-5 rounded-2xl rounded-br-sm shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] text-[#4B5563] max-w-xl text-[15px] font-medium">
                        {msg.text}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-sm">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=fbd38d" alt="User Avatar" />
                    </div>
                  </div>
                ) : (
                  /* Bot Message */
                  <div key={msg.id} className="flex justify-start items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 overflow-hidden shrink-0 shadow-sm border border-white">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Zen&backgroundColor=b2f5ea" alt="Bot Avatar" />
                    </div>
                    <div className="relative group">
                      <button className="absolute -right-10 top-1/2 -translate-y-1/2 text-gray-600 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                      <div className="bg-white p-6 rounded-2xl rounded-bl-sm shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] text-[#4B5563] max-w-2xl text-[15px] leading-relaxed border-l-4 border-[#1E2B58]">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              ))
            )}
          </div>

          {/* Bottom Input */}
          <div className="mt-6 bg-white rounded-2xl p-2 flex items-center shadow-lg border border-gray-100">
            <input type="text" placeholder="Type a new message here" className="flex-1 px-5 py-3 outline-none text-[#4B5563] bg-transparent text-[15px]" />
            <div className="flex items-center gap-5 pr-4 text-[#4B5563]">
              <button className="hover:text-black transition">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </button>
              <button className="hover:text-black transition">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </button>
              <button className="hover:text-black transition">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ChatBotInterface;