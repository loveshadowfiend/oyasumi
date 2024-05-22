import Header from "@/components/header";
import QueryProvider from "@/components/tanstack/query-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export default function ChapterLayout({
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
                    <div className="px-[50px] border-b-[1px]">
                        <Header className="h-[100px] mb-[0px]" />
                    </div>
                    {children}
                </QueryProvider>
            </body>
        </html>
    );
}
