import RecentReads from "@/components/home-page/recent-reads";
import PopularNewTitles from "@/components/home-page/popular-new-titles";
import RecentlyUpdated from "@/components/home-page/recently-updated";

export default function Home() {
    return (
        <main className="flex flex-col gap-10">
            <PopularNewTitles />
            <RecentReads />
            <RecentlyUpdated />
        </main>
    );
}
