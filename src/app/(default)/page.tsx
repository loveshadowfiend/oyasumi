import PopularNewTitles from "@/components/home-page/popular-new-titles";
import RecentlyUpdated from "@/components/home-page/recently-updated";
import { Input } from "@/components/ui/input";

export default function Home() {
    return (
        <main className="flex flex-col gap-10">
            <PopularNewTitles />
            <RecentlyUpdated />
        </main>
    );
}
