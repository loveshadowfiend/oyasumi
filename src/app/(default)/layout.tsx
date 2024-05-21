import Header from "@/components/Header";
import QueryProvider from "@/components/tanstack/QueryProvider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased dark",
                    fontSans.variable
                )}
            >
                <QueryProvider>
                    <div className="px-[20px] pb-5 md:px-[100px]">
                        <Header />
                        {children}
                    </div>
                </QueryProvider>
            </body>
        </html>
    );
}
