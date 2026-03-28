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
          <p className="mb-2">Sure, here are the services provided:</p>
          <ol className="list-decimal pl-4 space-y-1 text-gray-700">
            <li><strong className="font-semibold text-gray-900">AI Support For Event Planning:</strong> Our advanced AI tools assist planners in organizing seamless events by providing intelligent recommendations and automating routine tasks.</li>
            <li><strong className="font-semibold text-gray-900">Budget Planning Support:</strong> We offer comprehensive budget planning tools to help you manage your event expenses efficiently and stay within your financial limits.</li>
            <li><strong className="font-semibold text-gray-900">Virtual Event Support:</strong> Our platform enables you to host engaging virtual events with robust features for live streaming, interactive sessions, and attendee management.</li>
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      
      {/* Main Container */}
      <div className="flex w-full max-w-6xl h-[90vh] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
        
        {/* Left Sidebar */}
        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-gray-50 border-r border-gray-200 relative z-0 ${isSidebarOpen ? 'w-[300px] sm:w-[340px]' : 'w-0'}`}>
          <div className="w-[300px] sm:w-[340px] h-full p-6 flex flex-col relative z-10">
            
            {/* Hamburger (Close) */}
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
                aria-label="Close sidebar"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            </div>

            <button 
              onClick={handleNewChat}
              className="flex items-center justify-center gap-3 p-3.5 bg-blue-500 rounded-full mb-6 text-white hover:bg-blue-600 transition shadow-sm w-full font-medium"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>New Chat</span>
            </button>

            {/* Recent Chats Header */}
            <div className="flex items-center gap-3 px-2 mb-3 text-gray-500">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="text-sm font-semibold tracking-wide uppercase">Recent Chats</span>
            </div>

            {/* Chat History */}
            <div className="flex flex-col gap-1 overflow-y-auto mb-4 -mx-2 px-2">
              <div className="p-3 bg-gray-200/50 text-blue-600 rounded-xl text-[14px] font-medium cursor-pointer transition">
                How to reduce the budget?
              </div>
              <div className="p-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl text-[14px] cursor-pointer transition">
                How to organize an event
              </div>
              <div className="p-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-xl text-[14px] cursor-pointer transition truncate">
                What is the minimum price for music and light?
              </div>
            </div>

            {/* User Profile */}
            <div className="mt-auto bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden border border-blue-200">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}&backgroundColor=e0f2fe`} alt="User" className="w-full h-full object-cover"/>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">Logged in as</p>
                  <p className="text-[14px] font-bold text-gray-800 leading-tight truncate max-w-[120px]">{user?.name || 'Guest User'}</p>
                </div>
              </div>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Right Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center">
              {!isSidebarOpen && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition mr-4"
                  aria-label="Open sidebar"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
              )}
              <h2 className="text-lg font-bold text-gray-800">EventZen Assistant</h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Search matching the header component */}
              <div className="relative hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-[250px]">
                <svg className="text-gray-500 mr-2" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="Search chat..." className="bg-transparent outline-none flex-1 text-sm text-gray-700" />
              </div>

              <button 
                onClick={handleNewChat}
                className="text-gray-500 hover:text-blue-500 transition p-2 bg-gray-50 rounded-full hover:bg-blue-50"
                title="Clear Chat"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Bubbles */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-6 p-6 sm:p-8">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="text-blue-500" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-600">How can I help you plan today?</p>
              </div>
            ) : (
              messages.map((msg) => (
                msg.sender === 'user' ? (
                  /* User Message */
                  <div key={msg.id} className="flex justify-end items-end gap-3">
                    <div className="relative group">
                      <div className="bg-blue-500 px-5 py-3.5 rounded-2xl rounded-br-sm shadow-sm text-white max-w-xl text-[15px] font-medium leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-200">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}&backgroundColor=e0f2fe`} alt="User Avatar" />
                    </div>
                  </div>
                ) : (
                  /* Bot Message */
                  <div key={msg.id} className="flex justify-start items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden shrink-0 border border-blue-200 flex items-center justify-center">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=EventZen&backgroundColor=bfdbfe" alt="Bot Avatar" className="w-6 h-6"/>
                    </div>
                    <div className="relative group">
                      <div className="bg-gray-100 p-5 rounded-2xl rounded-bl-sm shadow-sm text-gray-800 max-w-2xl text-[15px] leading-relaxed border-l-4 border-blue-500">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              ))
            )}
          </div>

          {/* Bottom Input Area */}
          <div className="p-6 pt-0">
            <div className="bg-gray-100 rounded-full p-2 flex items-center border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
              <input 
                type="text" 
                placeholder="Type your message here..." 
                className="flex-1 px-5 py-2 outline-none text-gray-800 bg-transparent text-[15px] placeholder-gray-500" 
              />
              <div className="flex items-center gap-2 pr-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                </button>
                <button className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-full transition flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[-1px] translate-y-[1px]">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="text-xs text-gray-400">EventZen AI can make mistakes. Consider verifying important event details.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ChatBotInterface;