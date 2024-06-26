"use client";

import { cn } from "@/lib/utils";
import useChapterStore from "@/stores/chapterStore";
import { Settings } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { ChapterSettingsForm } from "./chapter-settings-form";

export const ChapterHeader = (props: React.ComponentProps<"div">) => {
    const {
        mangaID,
        mangaTitle,
        chapterNumber,
        nextChapterLink,
        previousChapterLink,
    } = useChapterStore();

    return (
        <header className={cn("h-[75px] border-b-[1px]", props.className)}>
            <div className="flex justify-center items-center h-full px-[20px] md:px-[60px] xl:px-[100px]">
                <div className="flex flex-1 items-center">
                    <Link
                        className="text-sm line-clamp-1 font-bold md:text-md"
                        href={`/manga/${mangaID}`}
                    >
                        {mangaTitle}
                    </Link>
                    <span className="hidden pl-[20px] text-sm md:inline">
                        Глава {chapterNumber}
                    </span>
                </div>
                <div />
                <div className="flex justify-center items-center gap-3">
                    <Link href={previousChapterLink} scroll={false}>
                        <ArrowLeft />
                    </Link>
                    <Link href={nextChapterLink} scroll={false}>
                        <ArrowRight />
                    </Link>
                    <Dialog>
                        <DialogTrigger>
                            <Settings className="flex-1" />
                        </DialogTrigger>
                        <DialogContent className="w-[80vw]">
                            <DialogHeader>
                                <DialogTitle>Настройки</DialogTitle>
                                <div className="w-full pt-4">
                                    <ChapterSettingsForm />
                                </div>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </header>
    );
};
