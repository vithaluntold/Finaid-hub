"use client";

import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

interface ToastContextType {
  showToast: (options: { title: string; description: string }) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const showToast = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    setTitle(title);
    setDescription(description);
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast.Provider swipeDirection="right">
        {children}

        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`${
            title === "Error" ? "bg-destructive" : "bg-primary"
          } text-white px-4 py-2 rounded shadow-md`}
        >
          <Toast.Title className="font-semibold">{title}</Toast.Title>
          <Toast.Description className="text-sm">
            {description}
          </Toast.Description>
        </Toast.Root>

        <Toast.Viewport className="fixed bottom-4 right-4 w-96 z-[9999]" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
