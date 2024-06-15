"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useLatestMangaStore from "@/stores/latestMangaStore";
import { Delete, X } from "lucide-react";
import { Button } from "../ui/button";

export default function RecentReads() {
    const { latestMangas, clear } = useLatestMangaStore();

    if (latestMangas.length <= 1) return;

    return (
        <div>
            <div className="flex items-center pb-3 w-full h-full justify-between">
                <span className="font-semibold text-lg">Прочитано недавно</span>

                <span
                    className="pl-3 cursor-pointer text-sm hover:underline"
                    onClick={() => {
                        clear();
                    }}
                >
                    Очистить историю
                </span>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
                <div
                    className="flex w-max space-x-4 pb-3
                                xl:grid xl:grid-cols-6 xl:w-full"
                >
                    {[...latestMangas]
                        .reverse()
                        .slice(0, 10)
                        .map((manga, index) => {
                            if (manga.mangaID === "") return;

                            const coverURL = manga.coverURL;
                            const mangaTitle = manga.mangaTitle;
                            const pathname = manga.pathname;

                            return (
                                <Link
                                    className="w-[200px] xl:w-auto"
                                    key={index}
                                    href={`/manga/${manga.mangaID}`}
                                >
                                    <div className="flex flex-col gap-1 break-normal">
                                        <div className="relative flex-1 w-auto h-[300px]">
                                            <Image
                                                className="object-cover w-full h-[300px] rounded-md"
                                                src={coverURL}
                                                alt={`${mangaTitle} cover`}
                                                width={200}
                                                height={300}
                                            />
                                            <div className="opacity-0 hover:opacity-100 absolute bg-black/30 top-0 h-full w-full rounded-md z-1">
                                                <div className="h-full flex items-end justify-center z-50"></div>
                                                <X className="absolute top-1 right-1" />
                                            </div>
                                        </div>
                                        <p className="text-[14px] font-medium truncate">
                                            {mangaTitle}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
