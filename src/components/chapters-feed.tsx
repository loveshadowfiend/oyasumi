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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchFeed } from "@/api/feed";

interface ChaptersFeedProps {
    mangaID: string;
}

export const ChaptersFeed = (props: ChaptersFeedProps) => {
    const [orderChapter, setOrderChapter] = useState<"asc" | "desc">("desc");
    const [page, setPage] = useState(0);

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
                    <TableRow className="invisible">
                        <TableCell className="w-full" />
                        <TableCell className="text-right" />
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};