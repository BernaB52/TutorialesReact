import React from "react";
import { EmailTable } from "./components/email-table";
import { ToastProvider } from "@heroui/react";

export default function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Email Management</h1>
        <EmailTable />
      </div>
    </div>
  );
}