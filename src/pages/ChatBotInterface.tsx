import React, { useState, useEffect, useRef } from 'react';

import { useAuthUser } from '../features/auth/hooks/useAuthUser';



function ChatBotInterface() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { user } = useAuthUser();

 

  // New state variables for dynamic data

  const [messages, setMessages] = useState([]);

  const [inputValue, setInputValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [currentChatId, setCurrentChatId] = useState(null);

  const [recentChats, setRecentChats] = useState([]);



  // Ref to automatically scroll to the bottom of the chat

  const messagesEndRef = useRef(null);



  // Scroll to bottom whenever messages change

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);



  // Fetch recent chats for the sidebar when the component loads

  useEffect(() => {

    const fetchRecentChats = async () => {

      if (!user?.id) return; // Assuming your user object has an 'id' or '_id'

      try {

        const response = await fetch(`http://localhost:5009/api/chatbot/user/${user.id}`);

        if (response.ok) {

          const data = await response.json();

          setRecentChats(data);

        }

      } catch (error) {

        console.error("Failed to fetch recent chats", error);

      }

    };



    fetchRecentChats();

  }, [user]);



  const handleNewChat = () => {

    setMessages([]);

    setCurrentChatId(null);

  };



  const handleSendMessage = async (e) => {

    e.preventDefault();

    if (!inputValue.trim() || !user) return;



    const userMessage = inputValue.trim();

    setInputValue(''); // Clear input immediately

    setIsLoading(true);



    // Optimistically add user message to UI

    const tempUserMessage = { id: Date.now(), sender: 'user', text: userMessage };

    setMessages((prev) => [...prev, tempUserMessage]);



    try {

      // Send to backend

      const response = await fetch('http://localhost:5009/api/chatbot/send', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          userId: user.id, // Ensure this matches how your useAuthUser hook exposes the ID

          chatId: currentChatId,

          message: userMessage

        })

      });



      if (!response.ok) throw new Error("Network response was not ok");

     

      const data = await response.json();

     

      // Update state with the database's version of the messages

      setMessages(data.messages);

     

      // If this was a new chat, set the ID and refresh the sidebar

      if (!currentChatId) {

        setCurrentChatId(data.chatId);

        setRecentChats(prev => [{ chatId: data.chatId, title: data.title }, ...prev]);

      }



    } catch (error) {

      console.error("Failed to send message:", error);

      // Optional: Add a visual error message to the UI here

    } finally {

      setIsLoading(false);

    }

  };



  // Function to load a specific past chat

  const loadChat = async (chatId) => {

    if (!chatId) return;



    try {

      const response = await fetch(`http://localhost:5009/api/chatbot/chat/${chatId}`);

      if (!response.ok) {

        console.error('Failed to load chat', response.statusText);

        return;

      }



      const data = await response.json();

      setCurrentChatId(data.chatId);

      setMessages(data.messages || []);

    } catch (error) {

      console.error('Failed to load chat:', error);

    }

  };



  return (

    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">

      <div className="flex w-full max-w-6xl h-[90vh] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xl">

       

        {/* Left Sidebar */}

        <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden bg-gray-50 border-r border-gray-200 relative z-0 ${isSidebarOpen ? 'w-[300px] sm:w-[340px]' : 'w-0'}`}>

          <div className="w-[300px] sm:w-[340px] h-full p-6 flex flex-col relative z-10">

            {/* ... [KEEP YOUR EXISTING SIDEBAR HEADER/NEW CHAT BUTTON] ... */}

           

            <div className="flex items-center gap-3 px-2 mb-3 text-gray-500 mt-6">

              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>

              </svg>

              <span className="text-sm font-semibold tracking-wide uppercase">Recent Chats</span>

            </div>



            {/* Dynamic Chat History */}

            <div className="flex flex-col gap-1 overflow-y-auto mb-4 -mx-2 px-2 flex-1">

              {recentChats.map((chat) => (

                <div

                  key={chat.chatId}

                  onClick={() => loadChat(chat.chatId)}

                  className={`p-3 rounded-xl text-[14px] cursor-pointer transition truncate ${

                    currentChatId === chat.chatId

                      ? 'bg-blue-50 text-blue-600 font-medium'

                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'

                  }`}

                >

                  {chat.title}

                </div>

              ))}

            </div>



            {/* ... [KEEP YOUR EXISTING USER PROFILE FOOTER] ... */}

          </div>

        </div>



        {/* Right Main Chat Area */}

        <div className="flex-1 flex flex-col bg-white relative overflow-hidden">

          {/* ... [KEEP YOUR EXISTING CHAT HEADER] ... */}



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

              messages.map((msg, index) => (

                msg.sender === 'user' ? (

                  /* User Message */

                  <div key={msg._id || index} className="flex justify-end items-end gap-3">

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

                  <div key={msg._id || index} className="flex justify-start items-end gap-3">

                    <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden shrink-0 border border-blue-200 flex items-center justify-center">

                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=EventZen&backgroundColor=bfdbfe" alt="Bot Avatar" className="w-6 h-6"/>

                    </div>

                    <div className="relative group">

                      <div className="bg-gray-100 p-5 rounded-2xl rounded-bl-sm shadow-sm text-gray-800 max-w-2xl text-[15px] leading-relaxed border-l-4 border-blue-500 whitespace-pre-wrap">

                        {msg.text}

                      </div>

                    </div>

                  </div>

                )

              ))

            )}

           

            {/* Loading Indicator */}

            {isLoading && (

               <div className="flex justify-start items-end gap-3">

                 <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden shrink-0 border border-blue-200 flex items-center justify-center">

                   <img src="https://api.dicebear.com/7.x/bottts/svg?seed=EventZen&backgroundColor=bfdbfe" alt="Bot" className="w-6 h-6"/>

                 </div>

                 <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">

                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>

                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>

                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>

                 </div>

               </div>

            )}

            {/* Invisible div to scroll to */}

            <div ref={messagesEndRef} />

          </div>



          {/* Bottom Input Area */}

          <form onSubmit={handleSendMessage} className="p-6 pt-0">

            <div className={`bg-gray-100 rounded-full p-2 flex items-center border transition-all ${isLoading ? 'opacity-50' : 'border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300'}`}>

              <input

                type="text"

                value={inputValue}

                onChange={(e) => setInputValue(e.target.value)}

                disabled={isLoading}

                placeholder="Type your message here..."

                className="flex-1 px-5 py-2 outline-none text-gray-800 bg-transparent text-[15px] placeholder-gray-500 disabled:bg-transparent"

              />

              <div className="flex items-center gap-2 pr-2">

                <button

                  type="submit"

                  disabled={isLoading || !inputValue.trim()}

                  className="p-2 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 rounded-full transition flex items-center justify-center shadow-sm"

                >

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

          </form>



        </div>

      </div>

    </div>

  );

}



export default ChatBotInterface;