"use client";

import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import useLatestMangaStore from "@/stores/latestMangaStore";
import { useEffect, useState } from "react";

export default function LatestRead() {
    const { latestMangas } = useLatestMangaStore();

    if (latestMangas.length <= 1) return;

    return (
        <div>
            <h3 className="font-semibold text-lg pb-3">Recent reads</h3>
            <ScrollArea className="w-full whitespace-nowrap">
                <div
                    className="flex w-max space-x-4 pb-3
                                xl:grid xl:grid-cols-6 xl:w-full"
                >
                    {[...latestMangas].reverse().map((manga, index) => {
                        if (manga.mangaID === "") return;

                        const coverURL = manga.coverURL;
                        const mangaTitle = manga.mangaTitle;
                        const pathname = manga.pathname;

                        return (
                            <Link
                                className="w-[200px] xl:w-auto"
                                key={index}
                                href={pathname}
                            >
                                <div className="flex flex-col gap-1 break-normal">
                                    <Image
                                        className="object-cover w-auto h-[300px] rounded-md"
                                        src={coverURL}
                                        alt={`${mangaTitle} cover`}
                                        width={200}
                                        height={300}
                                    />
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
