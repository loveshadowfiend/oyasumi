"use client";

import { cn } from "@/lib/utils";
import useChapterStore from "@/stores/chapterStore";
import { Settings } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";

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
            <div className="flex justify-center items-center h-full px-[100px]">
                <div className="flex-1">
                    <Link className="font-bold" href={`/manga/${mangaID}`}>
                        {mangaTitle}
                    </Link>
                    <span className="pl-[20px] text-sm">
                        Chapter {chapterNumber}
                    </span>
                </div>
                <div />
                <div className="flex justify-center items-center gap-3">
                    <Link href={previousChapterLink} prefetch={false}>
                        <ArrowLeft />
                    </Link>
                    <Link href={nextChapterLink} prefetch={false}>
                        <ArrowRight />
                    </Link>
                    <Settings className="flex-1" />
                </div>
            </div>
        </header>
    );
};
