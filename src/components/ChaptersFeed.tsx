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

interface ChaptersFeedProps {
    mangaID: string;
}

const fetchFeed = async (
    mangaID: string,
    orderChapter: string,
    offset: number,
    translatedLanguage: string[],
    limit: number
) => {
    const response = await fetch(
        `https://api.mangadex.org/manga/${mangaID}/feed?order[chapter]=${orderChapter}&offset=${offset}&translatedLanguage[]=${translatedLanguage}&limit=${limit}`
    );
    const data = await response.json();

    return data;
};

const fetchAtHome = async (chapterID: string) => {
    const response = await fetch(
        `https://api.mangadex.org/at-home/server/${chapterID}`
    );
    const data = await response.json();
};

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
                        feedData.data.map((element, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    onClick={() => {
                                        router.push(`/chapter/${element.id}`);
                                    }}
                                >
                                    <TableCell className="w-full">{`Chapter ${element.attributes.chapter}`}</TableCell>
                                    <TableCell className="text-center">{`${element.attributes.translatedLanguage}`}</TableCell>
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