// components/ChatDrawer.tsx
"use client";
import { useState } from "react";
import { X, MessageCircle } from "lucide-react";

export default function ChatDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b bg-gray-100">
          <h3 className="text-lg font-medium">Luca Assistant</h3>
          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Iframe */}
        <iframe
          src="https://askluca.io/"
          width="100%"
          height="100%"
          className="border-none h-[calc(100%-48px)]"
        ></iframe>
      </div>
    </>
  );
}
