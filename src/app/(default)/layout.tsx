import Header from "@/components/Header";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="px-[20px] pb-5 md:px-[100px]">
            <Header />
            {children}
        </div>
    );
}
