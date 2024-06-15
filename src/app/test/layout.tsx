import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/contexts/AuthContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <Toaster />

            <div className="flex gap-x-5">
                <header>
                    <Sidebar />
                </header>
                
                {children}
            </div>
        </AuthProvider>
  );
}