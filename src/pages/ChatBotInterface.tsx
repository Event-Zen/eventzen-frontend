import React from 'react';

function ChatBotInterface() {
  return (
    <div className="min-h-screen bg-[#060B19] flex items-center justify-center p-8 font-sans">
      <div className="flex w-full max-w-6xl h-[85vh] bg-[#9396A0] rounded-3xl overflow-hidden border-8 border-[#F3F4F6]/20">
        
        <div className="w-1/3 max-w-[320px] bg-[#0A0F1C] flex flex-col p-4 relative">
          
          <div className="flex justify-end mb-8">
            <button className="p-2 border border-white/20 rounded-md text-white">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>

          <button className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl mb-4 text-white">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">+</div>
            <span className="text-sm font-medium">New Chat</span>
          </button>

          <button className="flex items-center gap-4 p-4 bg-[#0A0F1C] border border-white/10 rounded-xl mb-2 text-white/70">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">v</div>
            <span className="text-sm font-medium">Recent Chats</span>
          </button>

          <div className="flex flex-col gap-2 overflow-y-auto mt-2">
            <div className="p-4 border border-white/5 rounded-xl text-white/60 text-sm cursor-pointer hover:bg-white/5">How to reduce the budget?</div>
            <div className="p-4 border border-white/5 rounded-xl text-white/60 text-sm cursor-pointer hover:bg-white/5">How to organize an event</div>
            <div className="p-4 border border-white/5 rounded-xl text-white/60 text-sm cursor-pointer hover:bg-white/5">What is the minimum price for music and light?</div>
          </div>

          <div className="mt-auto bg-[#F9FAFB] rounded-xl p-4 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-200 rounded-md overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Welcome back,</p>
                <p className="text-sm font-bold text-gray-900">Kasun Madushan</p>
              </div>
            </div>
            <svg width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2"><path d="M18 15l-6-6-6 6"></path></svg>
          </div>

        </div>

        <div className="flex-1 flex flex-col p-6 relative"></div>
      </div>
    </div>
  );
}

export default ChatBotInterface;