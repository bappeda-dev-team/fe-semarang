'use client'

import { useState, useEffect } from "react";
import { AppProvider } from "@/context/AppContext";
import { Poppins } from "next/font/google";
import { Sidebar } from "@/components/global/Sidebar";
import Header from "@/components/global/Header";
import { usePathname } from "next/navigation";
import { getUser } from "@/components/lib/Cookie";
import NextTopLoader from "nextjs-toploader";
import Image from "next/image";
import "./globals.css";

const font = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap', // Mengatur tampilan swap agar tidak ada flash saat font dimuat
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isZoomed, setIsZoomed] = useState<boolean | null>(null);
  const pathname = usePathname();
  const loginPage = pathname === "/login"

  const checkZoomLevel = () => {
    const zoomLevel = window.devicePixelRatio;
    if (zoomLevel >= 1.5) {
      setIsZoomed(true);
      setIsOpen(false); // Hide sidebar by default when zoom is 150%
    } else {
      setIsZoomed(false);
      setIsOpen(true); // Show sidebar when zoom level is below 150%
    }
  };

  useEffect(() => {
    const data = getUser();
    if (data) {
      setUser(data.user)
    }
    // Mengambil path dari URL tanpa domain dan protokol
    const path = window.location.pathname;
    // Mengganti judul (title) halaman dengan path (nama halaman)
    document.title = path.substring(1);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    checkZoomLevel();
    window.addEventListener('resize', checkZoomLevel);
    return () => window.removeEventListener('resize', checkZoomLevel);
  }, []);

  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "KERTAS-KERJA";

  if (loginPage) {
    return (
      <html lang="en" className={font.className}>
        <head>
          <title>{APP_NAME}</title>
          <meta name="description" content={APP_NAME} />
          <link rel="icon" href="/logo.png" />
        </head>
        <body>
          <div className="flex flex-wrap justify-center items-center h-screen"
            style={{
              backgroundImage: "url('/backgrounds/login-bg-2.png')",
              backgroundSize: "cover",  // Fit the image inside the box
              backgroundPosition: "center",
            }}
          >
            <div className="flex flex-wrap justify-center items-center gap-5 m-5 rounded-lg border bg-gray-300 hover:bg-white border-white shadow-lg shadow-white">
              <div className="flex flex-col justify-center items-center gap-3 m-2">
                <Image 
                  className="mx-[100px]"
                  src="/logo.png"
                  alt="logo"
                  width={90}
                  height={90}
                />
                <h1 className="uppercase font-bold text-xl">KOTA SEMARANG</h1>
              </div>
              {/* LOGIN FORM */}
              <div className="bg-gradient-to-tl from-[#cfa86a] to-[#eed920] rounded-tr-lg rounded-br-lg flex items-center justify-center p-10">
                <div className={`${font.className} w-full max-w-md`}>{children}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={font.className}>
      <head>
        <title>{APP_NAME}</title>
        <meta name="description" content={APP_NAME} />
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="flex">
        <NextTopLoader
          color="linear-gradient(to right, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234))"
        />
        <AppProvider>
          {!loginPage && <Sidebar isOpen={isOpen} toggleSidebar={() => toggleSidebar()} isZoomed={isZoomed} />}
          <div className={`w-full ${isOpen ? 'pl-[16rem]' : ''}`}>
            {!loginPage && <Header />}
            <div className={`${font.className} ${loginPage ? "" : "px-4 py-2"}`}>{children}</div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
