"use client";

import Link from "next/link";
import { SearchInput } from "@/components/header/search-input";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { SettingsForm } from "./settings-form";

export default function Header({ className }: ComponentProps<"div">) {
    return (
        <header
            className={cn(
                "flex flex-row items-center justify-between h-[100px] mb-5 px-[30px] border-b-[0.5px] md:px-[40px] lg:px-[100px]",
                className
            )}
        >
            <Link href="/">
                <span className="text-2xl font-bold md:text-4xl">oyasumi</span>
            </Link>
            <div className="flex flex-row items-center gap-4">
                <SearchInput />
                <Dialog>
                    <DialogTrigger>
                        <Settings />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Settings</DialogTitle>
                            <div className="pt-4">
                                <SettingsForm />
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    );
}
