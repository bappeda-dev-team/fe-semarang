'use client'

import { useState, createContext, useContext } from "react";

interface AppContextType {
  appName: string;
  setAppName: (name: string) => void;
}
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "KERTAS-KERJA";
const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [appName, setAppName] = useState(APP_NAME);
  return (
    <AppContext.Provider value={{ appName, setAppName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}
