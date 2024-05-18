import Header from "@/components/Header";

export default function ChapterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="px-[50px] border-b-[1px]">
                <Header className="h-[100px] mb-[0px]" />
            </div>
            {children}
        </>
    );
}
