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
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { fetchFeed } from "@/api/feed";
import { Skeleton } from "./ui/skeleton";

interface ChaptersFeedProps {
    mangaID: string;
}

export const ChaptersFeed = (props: ChaptersFeedProps) => {
    const [orderChapter, setOrderChapter] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(0);

    const chapters = new Set();

    const router = useRouter();

    const limit = 50;

    const { data: feedData, isLoading } = useQuery({
        enabled: !!props.mangaID,
        queryKey: ["feed", props.mangaID, orderChapter, page],
        queryFn: () =>
            fetchFeed(props.mangaID, orderChapter, page * limit, ["en"], limit),
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

    if (isLoading) {
        return <Skeleton className="w-full h-[500px]"></Skeleton>;
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
                            Chapter <ArrowUpDown size={16} className="pl-1" />
                        </TableHead>
                        <TableHead>Language</TableHead>
                    </TableRow>
                </TableHeader>
                <TableCaption>
                    <div className="flex gap-3 items-center justify-center">
                        {pages}
                    </div>
                </TableCaption>
                <TableBody>
                    {feedData !== undefined &&
                        feedData.data.map((chapter, index) => {
                            if (
                                chapters.has(chapter.attributes.chapter) ||
                                !chapter.attributes.pages
                            )
                                return;

                            chapters.add(chapter.attributes.chapter);

                            return (
                                <TableRow
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        router.push(`/chapter/${chapter.id}/1`);
                                    }}
                                >
                                    <TableCell className="w-full">{`Chapter ${chapter.attributes.chapter}`}</TableCell>
                                    <TableCell className="text-center">{`${chapter.attributes.translatedLanguage}`}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </div>
    );
};
