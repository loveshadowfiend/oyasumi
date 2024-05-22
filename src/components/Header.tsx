import Link from "next/link";
import { Input } from "./ui/input";
import { SearchInput } from "@/components/search-input";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function Header({ className }: ComponentProps<"div">) {
    return (
        <header
            className={cn(
                "flex flex-row items-center justify-between h-[100px] mb-5",
                className
            )}
        >
            <Link href="/">
                <span className="text-4xl font-bold">oyasumi</span>
            </Link>
            <div className="flex flex-row items-center gap-4">
                <SearchInput />
            </div>
        </header>
    );
}
