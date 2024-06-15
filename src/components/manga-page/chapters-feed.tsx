"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { fetchFeed } from "@/api/feed";
import { Skeleton } from "../ui/skeleton";
import useSettingsStore from "@/stores/settingsStore";
import { LANGUAGES } from "@/constants/languages";

interface ChaptersFeedProps {
    mangaID: string;
}

export const ChaptersFeed = (props: ChaptersFeedProps) => {
    const { translatedLanguage } = useSettingsStore();
    const [orderChapter, setOrderChapter] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(0);
    const [feed, setFeed] = useState<any[]>([]);

    const chapters = new Set();

    const router = useRouter();

    const limit = 100;

    const { data: feedData, isLoading } = useQuery({
        enabled: !!props.mangaID,
        queryKey: [
            "feed",
            props.mangaID,
            orderChapter,
            page,
            translatedLanguage,
        ],
        queryFn: () =>
            fetchFeed(
                props.mangaID,
                orderChapter,
                page * limit,
                translatedLanguage,
                limit
            ),
        refetchOnWindowFocus: false,
    });

    let pages = [];

    for (let i = 0; feedData !== undefined && i < feedData.total / limit; i++) {
        pages.push(
            <div
                className={cn(
                    "flex items-center cursor-pointer hover:underline",
                    {
                        "text-foreground": i == page,
                    }
                )}
                onClick={() => {
                    setPage(i);
                }}
            >
                {i + 1}
            </div>
        );
    }

    useEffect(() => {
        if (feedData === undefined) return;

        let _feed: any[] = [];
        feedData.data.map((chapter) => {
            const element = {
                id: chapter.id,
                attributes: {
                    volume: chapter.attributes.volume,
                    chapter: chapter.attributes.chapter,
                    translatedLanguage: chapter.attributes.translatedLanguage,
                    pages: chapter.attributes.pages,
                    title: chapter.attributes.title,
                },
            };

            if (!element.attributes.pages) return;

            _feed.push(element);
        });

        setFeed(_feed);
    }, [feedData]);

    if (isLoading) {
        return <Skeleton className="w-full h-[500px]"></Skeleton>;
    }

    if (!feedData.data.length) {
        return (
            <div className="w-full flex items-center justify-center italic pt-3">
                Глав не найдено :( Попробуйте изменить язык перевода в
                настройках
            </div>
        );
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            className="flex items-center cursor-pointer"
                            onClick={() => {
                                // if order is ascending
                                if (orderChapter.startsWith("a")) {
                                    setOrderChapter("desc");
                                } else {
                                    setOrderChapter("asc");
                                }
                            }}
                        >
                            Глава <ArrowUpDown size={16} className="pl-1" />
                        </TableHead>
                        <TableHead>Язык</TableHead>
                    </TableRow>
                </TableHeader>
                <TableCaption>
                    <div className="flex gap-3 items-center justify-center">
                        {pages}
                    </div>
                </TableCaption>
                <TableBody>
                    {feed.length > 0 &&
                        feed.map((chapter, index) => {
                            if (
                                chapters.has(chapter.attributes.chapter) ||
                                !chapter.attributes.pages
                            )
                                return;

                            chapters.add(chapter.attributes.chapter);

                            const chapterVolume = chapter.attributes.volume
                                ? `Том ${chapter.attributes.volume} `
                                : "";
                            const chapterTitle = chapter.attributes.title
                                ? `— ${chapter.attributes.title}`
                                : "";

                            return (
                                <TableRow
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        router.push(`/chapter/${chapter.id}/1`);
                                    }}
                                >
                                    <TableCell className="w-full">
                                        {chapterVolume}
                                        {`Глава ${chapter.attributes.chapter}
                                    ${chapterTitle}`}
                                    </TableCell>
                                    <TableCell className="text-center">{`${LANGUAGES.get(
                                        chapter.attributes.translatedLanguage
                                    )}`}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </div>
    );
};
