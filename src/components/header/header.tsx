"use client";

import Link from "next/link";
import { SearchInput } from "@/components/header/search-input";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Home, Search, Settings } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SettingsForm } from "./settings-form";
import useSearchStore from "@/stores/searchStore";

export default function Header({ className }: ComponentProps<"div">) {
    const { isDialogOpen, toggleDialog } = useSearchStore();

    return (
        <header
            className={cn(
                "fixed backdrop-blur-md bg-background/95 z-50 w-screen flex flex-row items-center justify-between h-[60px] mb-5 px-[20px] border-b-[0.5px] lg:px-[100px] lg:h-[80px] supports-[backdrop-filter]:bg-background/60",
                className
            )}
        >
            <Link href="/">
                <span className="hidden text-2xl font-bold md:text-4xl md:block">
                    oyasumi
                </span>
                <Link href={"/"}>
                    <Home className="md:hidden" />
                </Link>
            </Link>
            <div className="flex flex-row items-center gap-4">
                <SearchInput className="hidden md:block" isDialog={false} />
                <div className="flex items-center md:hidden">
                    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
                        <DialogTrigger>
                            <Search />
                        </DialogTrigger>
                        <DialogContent className="w-[80vw]">
                            <SearchInput className="w-full" isDialog={true} />
                        </DialogContent>
                    </Dialog>
                </div>
                <Dialog>
                    <DialogTrigger>
                        <Settings />
                    </DialogTrigger>
                    <DialogContent className="w-[80vw]">
                        <DialogHeader>
                            <DialogTitle>Настройки</DialogTitle>
                            <div className="w-full pt-4">
                                <SettingsForm />
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    );
}
