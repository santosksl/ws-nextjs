import Sidebar from "@/components/layout/header/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/contexts/AuthContext";
import "./style.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <Toaster />

            <div className="flex bg-neural-900">
                <header>
                    <Sidebar />
                </header>
                
                {children}
            </div>
        </AuthProvider>
  );
}