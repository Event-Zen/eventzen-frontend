import React from 'react';

function ChatBotInterface() {
  return (
    <div className="min-h-screen bg-[#060B19] flex items-center justify-center p-8 font-sans">
      
      <div className="flex w-full max-w-6xl h-[85vh] bg-[#9396A0] rounded-3xl overflow-hidden border-8 border-[#F3F4F6]/20">
        
        <div className="w-1/3 max-w-[320px] bg-[#0A0F1C] flex flex-col p-4 relative">
          <div className="text-white/50 text-sm">Sidebar</div>
        </div>

        <div className="flex-1 flex flex-col p-6 relative">
           <div className="text-black/50 text-sm">Main Area</div>
        </div>

      </div>
    </div>
  );
}

export default ChatBotInterface;