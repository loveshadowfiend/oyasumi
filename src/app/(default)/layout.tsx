import Header from "@/components/header";
import QueryProvider from "@/components/tanstack/query-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import useSettingsStore from "@/stores/settingsStore";

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
                            <Header className="px-[100px] border-b-[0.5px]" />
                            <div className="px-[100px]">{children}</div>
                        </div>
                    </QueryProvider>
                </body>
            </html>
        </ThemeProvider>
    );
}
