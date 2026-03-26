import React from "react";

function ChatBotInterface() {
  return (
    <div className="min-h-screen bg-[#060B19] flex items-center justify-center p-8 font-sans">
      <div className="flex w-full max-w-6xl h-[85vh] bg-[#9396A0] rounded-3xl overflow-hidden border-8 border-[#F3F4F6]/20">
        {/* Left Side bar */}
        <div className="w-1/3 max-w-[320px] bg-[#0A0F1C] flex flex-col p-4 relative">
          <div className="flex justify-end mb-8">
            <button className="p-2 border border-white/20 rounded-md text-white">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          <button className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl mb-4 text-white">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              +
            </div>
            <span className="text-sm font-medium">New Chat</span>
          </button>

          <button className="flex items-center gap-4 p-4 bg-[#0A0F1C] border border-white/10 rounded-xl mb-2 text-white/70">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
              v
            </div>
            <span className="text-sm font-medium">Recent Chats</span>
          </button>

          <div className="flex flex-col gap-2 overflow-y-auto mt-2">
            <div className="p-4 border border-white/5 rounded-xl text-white/60 text-sm cursor-pointer hover:bg-white/5">
              How to reduce the budget?
            </div>
            <div className="p-4 border border-white/5 rounded-xl text-white/60 text-sm cursor-pointer hover:bg-white/5">
              How to organize an event
            </div>
            <div className="p-4 border border-white/5 rounded-xl text-white/60 text-sm cursor-pointer hover:bg-white/5">
              What is the minimum price for music and light?
            </div>
          </div>

          <div className="mt-auto bg-[#F9FAFB] rounded-xl p-4 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-200 rounded-md overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User"
                />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                  Welcome back,
                </p>
                <p className="text-sm font-bold text-gray-900">
                  Kasun Madushan
                </p>
              </div>
            </div>
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            >
              <path d="M18 15l-6-6-6 6"></path>
            </svg>
          </div>
        </div>

        {/* Right Area */}
        <div className="flex-1 flex flex-col p-6 relative">
          <div className="flex justify-end items-center gap-6 mb-8">
            <button className="text-[#E87B5D]">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2L1 21h22M12 9v5m0 4h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button className="text-[#3F4B73]">
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-9 4v6m4-6v6m-4-6v6"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <div className="relative">
              <svg
                className="absolute left-4 top-2.5 text-gray-400"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                className="pl-12 pr-4 py-2 w-64 rounded-full bg-white shadow-sm outline-none text-sm text-gray-700"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-6 px-4"></div>

          <div className="mt-4 bg-white rounded-2xl p-2 flex items-center shadow-lg">
            <input
              type="text"
              placeholder="Type a new message here"
              className="flex-1 px-4 py-3 outline-none text-gray-700 bg-transparent"
            />
            <div className="flex items-center gap-4 pr-4 text-gray-700">
              <button>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                </svg>
              </button>
              <button>
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
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
