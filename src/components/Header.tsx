import Link from "next/link";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function Header() {
    return (
        <header className="flex flex-row items-center justify-between h-[100px] mb-10">
            <Link href="/">
                <span className="text-4xl font-bold">oyasumi</span>
            </Link>
            <div className="flex flex-row items-center gap-4">
                <Input className="w-[300px]" placeholder="search" />
            </div>
        </header>
    );
}
