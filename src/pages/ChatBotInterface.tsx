import React from "react";

function ChatBotInterface() {
  return (
    <div className="min-h-screen bg-[#060B19] flex items-center justify-center p-8 font-sans">
      <div className="flex w-full max-w-6xl h-[85vh] bg-[#9396A0] rounded-3xl overflow-hidden border-8 border-white/10">
        <div className="w-1/3 max-w-[320px] bg-[#0A0F1C] flex flex-col p-4 relative">
          <div className="flex justify-end mb-8">
            <button className="p-2 border border-white/20 rounded-md text-white hover:bg-white/10 transition">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          <button className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl mb-4 text-white hover:bg-white/10 transition">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              +
            </div>
            <span className="text-sm font-medium">New Chat</span>
          </button>

          <button className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl mb-2 text-white/70 hover:bg-white/10 transition">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
            </div>
            <span className="text-sm font-medium">Recent Chats</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col p-6 relative"></div>
      </div>
    </div>
  );
}

export default ChatBotInterface;
