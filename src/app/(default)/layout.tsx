import Header from "@/components/header/header";
import QueryProvider from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: "oyasumi",
    description: "oyasumi — manga reading web app powered by mangadex!",
};

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
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <QueryProvider>
                        <div
                            className={cn(
                                "min-h-screen bg-background font-sans antialiased pb-5",
                                fontSans.variable
                            )}
                        >
                            <Header className="2xl:px-[200px]" />
                            <div className="pt-[80px] lg:pt-[100px] px-[20px] lg:px-[100px] 2xl:px-[200px]">
                                {children}
                            </div>
                        </div>
                        <Toaster />
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
