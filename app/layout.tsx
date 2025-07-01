import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "双路逆变电压电流调节系统",
  description: "现代化双路逆变电压电流调节控制系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`}
      >
        {/* 顶部逆变电压电流调节系统 */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
          <div className="container mx-auto px-6 py-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-pulse">
                双路逆变电压电流调节系统
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Dual-Channel Inverter Voltage Current Regulation System
              </p>
            </div>
          </div>
        </header>

        {/* 主内容区域 */}
        <main className="flex-1 relative">
          {/* 背景装饰效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          {/* 网格背景 */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          <div className="relative z-10">
            {children}
          </div>
        </main>

        {/* 底部信息 */}
        <footer className="bg-black/50 backdrop-blur-md border-t border-purple-500/20 py-6">
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                赵晋明
              </div>
              <div className="text-lg text-gray-300">
                学号：1034230319
              </div>
              <div className="text-sm text-gray-500 mt-4">
                © 2025 双路逆变电压电流调节系统 - 现代化控制界面
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
