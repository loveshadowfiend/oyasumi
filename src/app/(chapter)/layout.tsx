import Header from "@/components/header";
import QueryProvider from "@/components/tanstack/query-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ChapterHeader } from "@/components/chapter-header";

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
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable
                )}
            >
                <QueryProvider>
                    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
                        {children}
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
