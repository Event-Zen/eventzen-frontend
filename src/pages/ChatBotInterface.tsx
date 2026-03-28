import React, { useState, useEffect, useRef } from "react";
import { useAuthUser } from "../features/auth/hooks/useAuthUser";

export default function ChatBotInterface({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuthUser();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [recentChats, setRecentChats] = useState<any[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // Fetch recent chats for the sidebar when the component loads
  useEffect(() => {
    const fetchRecentChats = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(
          `http://localhost:5009/api/chatbot/user/${user.id}`,
        );
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

  // Handle starting a brand new conversation
  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setIsSidebarOpen(false);
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    const tempUserMessage = {
      id: Date.now(),
      sender: "user",
      text: userMessage,
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await fetch("http://localhost:5009/api/chatbot/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          chatId: currentChatId,
          message: userMessage,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      setMessages(data.messages);

      // If this was a new chat, set the ID and refresh the sidebar
      if (!currentChatId) {
        setCurrentChatId(data.chatId);
        setRecentChats((prev) => [
          { chatId: data.chatId, title: data.title },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load past chat from the sidebar
  const loadChat = async (chatId: string) => {
    if (!chatId) return;

    try {
      const response = await fetch(
        `http://localhost:5009/api/chatbot/chat/${chatId}`,
      );
      if (!response.ok) {
        console.error("Failed to load chat", response.statusText);
        return;
      }

      const data = await response.json();
      setCurrentChatId(data.chatId);
      setMessages(data.messages || []);

      // Close sidebar after selecting a chat so user can see it
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  return (
    <div className="flex w-full h-full max-h-[650px] bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-2xl relative font-sans">
      {/* Optional Overlay to click outside and close sidebar */}
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black/10 z-10"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Absolute positioned to slide over the chat */}
      <div
        className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out overflow-hidden bg-gray-50 border-r border-gray-200 z-20 shadow-lg ${isSidebarOpen ? "w-[280px]" : "w-0 border-none"}`}
      >
        <div className="w-[280px] h-full p-6 flex flex-col relative z-10">
          {/* Hamburger (Close Sidebar) */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
              aria-label="Close sidebar"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-3 p-3.5 bg-blue-500 rounded-full mb-6 text-white hover:bg-blue-600 transition shadow-sm w-full font-medium"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Chat</span>
          </button>

          <div className="flex items-center gap-3 px-2 mb-3 text-gray-500 mt-2">
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="text-sm font-semibold tracking-wide uppercase">
              Recent Chats
            </span>
          </div>

          {/* Dynamic Chat History */}
          <div className="flex flex-col gap-1 overflow-y-auto mb-4 -mx-2 px-2 flex-1">
            {recentChats.map((chat) => (
              <div
                key={chat.chatId}
                onClick={() => loadChat(chat.chatId)}
                className={`p-3 rounded-xl text-[14px] cursor-pointer transition truncate ${
                  currentChatId === chat.chatId
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {chat.title}
              </div>
            ))}
            {recentChats.length === 0 && (
              <p className="text-sm text-gray-400 px-3 py-2">
                No recent chats found.
              </p>
            )}
          </div>

          {/* User Profile Footer */}
          <div className="mt-auto bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full overflow-hidden border border-blue-200">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Guest"}&backgroundColor=e0f2fe`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">
                  Logged in as
                </p>
                <p className="text-[14px] font-bold text-gray-800 leading-tight truncate max-w-[120px]">
                  {user?.name || "Guest User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden">
        {/* Chat Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center">
            {/* Hamburger (Open Sidebar) */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition mr-3 sm:mr-4"
                aria-label="Open sidebar"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}
            <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="text-blue-500">✦</span> EventZen AI
            </h2>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {/* New Chat Icon Button */}
            <button
              onClick={handleNewChat}
              className="text-gray-500 hover:text-blue-500 transition p-2 bg-gray-50 rounded-full hover:bg-blue-50"
              title="New Chat"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
            </button>

            {/* Close Widget Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition p-2 rounded-full"
                title="Close AI Support"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Chat Bubbles */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto flex flex-col gap-6 p-4 sm:p-6 text-[14px] sm:text-[15px]"
        >
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <svg
                  className="text-blue-500"
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p className="font-medium text-gray-600">
                How can I help you plan today?
              </p>
            </div>
          ) : (
            messages.map((msg, index) =>
              msg.sender === "user" ? (
                /* User Message */
                <div
                  key={msg._id || index}
                  className="flex justify-end items-end gap-3"
                >
                  <div className="relative group">
                    <div className="bg-blue-500 px-4 py-3 rounded-2xl rounded-br-sm shadow-sm text-white max-w-[85%] font-medium leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ) : (
                /* Bot Message */
                <div
                  key={msg._id || index}
                  className="flex justify-start items-end gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden shrink-0 border border-blue-200 flex items-center justify-center">
                    <img
                      src="https://api.dicebear.com/7.x/bottts/svg?seed=EventZen&backgroundColor=bfdbfe"
                      alt="Bot Avatar"
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="relative group max-w-[85%]">
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm shadow-sm text-gray-800 leading-relaxed border-l-4 border-blue-500 whitespace-pre-wrap">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ),
            )
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start items-end gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden shrink-0 border border-blue-200 flex items-center justify-center">
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=EventZen&backgroundColor=bfdbfe"
                  alt="Bot"
                  className="w-6 h-6"
                />
              </div>
              <div className="bg-gray-100 p-3.5 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1 border-l-4 border-gray-300">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <form onSubmit={handleSendMessage} className="p-4 sm:p-6 pt-0">
          <div
            className={`bg-gray-100 rounded-full p-2 flex items-center border transition-all ${isLoading ? "opacity-50" : "border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300"}`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Ask AI for suggestions..."
              className="flex-1 px-4 sm:px-5 py-2 outline-none text-gray-800 bg-transparent text-[14px] sm:text-[15px] placeholder-gray-500 disabled:bg-transparent"
            />
            <div className="flex items-center gap-2 pr-1 sm:pr-2">
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="p-2 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 rounded-full transition flex items-center justify-center shadow-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="translate-x-[-1px] translate-y-[1px]"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
          <div className="text-center mt-3 hidden sm:block">
            <p className="text-xs text-gray-400">
              EventZen AI can make mistakes. Consider verifying important event
              details.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
