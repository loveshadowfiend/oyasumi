import Header from "@/components/header/header";
import QueryProvider from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Metadata } from "next";

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
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <html lang="en">
                <body
                    className={cn(
                        "min-h-screen bg-background font-sans antialiased",
                        fontSans.variable
                    )}
                >
                    <QueryProvider>
                        <div className="pb-5">
                            <Header />
                            <div className="px-[100px]">{children}</div>
                        </div>
                    </QueryProvider>
                </body>
            </html>
        </ThemeProvider>
    );
}
