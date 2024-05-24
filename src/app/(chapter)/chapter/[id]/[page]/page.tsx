"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

import Image from "next/image";
import Link from "next/link";
import { fetchAggregate, fetchAtHome, fetchChapter } from "@/api/chapter";

export default function ChapterPage({
    params,
}: {
    params: { id: string; page: number };
}) {
    const [page, setPage] = useState<number>(0);
    const [isProgressHidden, setIsProgressHidden] = useState<boolean>(false);

    const [mangaID, setMangaID] = useState<string>("");

    const [translatedLanguage, setTranslatedLanguage] = useState<string[]>([
        "",
    ]);

    const [previousChapterID, setPreviousChapterID] = useState<string>("");
    const [nextChapterID, setNextChapterID] = useState<string>("");
    const [previousChapterPages, setPreviousChapterPages] = useState<number>(0);

    const [aggregate, setAggregate] = useState<[]>([]);
    const [aggregateIndex, setAggregateIndex] = useState<number>(-1);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const ref = useRef(null);

    const { data: atHomeData, isLoading: isAtHomeLoading } = useQuery({
        enabled: !!params.id,
        queryKey: ["atHome", params.id],
        queryFn: () => fetchAtHome(params.id),
        refetchOnWindowFocus: false,
    });

    const { data: chapterData, isLoading: isChapterLoading } = useQuery({
        enabled: !!params.id,
        queryKey: ["chapter", params.id],
        queryFn: () => fetchChapter(params.id),
        refetchOnWindowFocus: false,
    });

    const { data: previousChapterData, isLoading: isPreviousChapterLoading } =
        useQuery({
            enabled: !!previousChapterID,
            queryKey: ["previousChapter", previousChapterID],
            queryFn: () => fetchChapter(previousChapterID),
            refetchOnWindowFocus: false,
        });

    const { data: aggregateData, isLoading: isAggregateLoading } = useQuery({
        enabled: !!mangaID,
        queryKey: ["aggregate", mangaID],
        queryFn: () => fetchAggregate(mangaID, translatedLanguage),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setPage(params.page - 1);
    }, []);

    useEffect(() => {
        setIsProgressHidden(false);

        const timeout = setTimeout(() => {
            setIsProgressHidden(true);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [page]);

    useEffect(() => {
        if (ref === null) return;

        window.scrollTo({ top: ref.current.offsetTop });
    }, [ref]);

    // get manga id
    useEffect(() => {
        if (chapterData === undefined) return;

        setMangaID(
            chapterData.data.relationships.filter((rel: { type: string }) => {
                return rel.type == "manga";
            })[0].id
        );
        setTranslatedLanguage(chapterData.data.attributes.translatedLanguage);
    }, [chapterData]);

    useEffect(() => {
        if (aggregateData === undefined) return;

        let _aggregate = [];
        Object.keys(aggregateData.volumes).map(
            (volumeKey, volumeIndex, volumeArray) => {
                Object.keys(aggregateData.volumes[volumeKey].chapters).map(
                    (chapterKey, chapterIndex, chapterArray) => {
                        const chapterID =
                            aggregateData.volumes[volumeKey].chapters[
                                chapterKey
                            ].id;

                        console.log(_aggregate);

                        _aggregate = [
                            ..._aggregate,
                            {
                                volume: volumeKey,
                                chapter: chapterKey,
                                chapterID: chapterID,
                            },
                        ];
                    }
                );
            }
        );

        _aggregate = _aggregate.reverse();
        setAggregate(_aggregate);

        _aggregate.forEach((chapter, index) => {
            if (chapter.chapterID === params.id) {
                setAggregateIndex(index);
            }
        });
    }, [aggregateData]);

    useEffect(() => {
        if (!aggregate.length || aggregateIndex === -1) return;

        const next = aggregate[aggregateIndex - 1];
        const prev = aggregate[aggregateIndex + 1];

        setNextChapterID(next ? next.chapterID : "");
        setPreviousChapterID(prev ? prev.chapterID : "");
    }, [aggregateIndex]);

    useEffect(() => {
        if (previousChapterData !== undefined) {
            setPreviousChapterPages(previousChapterData.data.attributes.pages);
        }
    }, [previousChapterData]);

    useEffect(() => {
        if (
            !isAggregateLoading &&
            !isAtHomeLoading &&
            !isChapterLoading &&
            !isPreviousChapterLoading
        ) {
            setIsLoading(false);
        }
    }, [
        isAggregateLoading,
        isAtHomeLoading,
        isChapterLoading,
        isPreviousChapterLoading,
    ]);

    return (
        <main>
            <div className="w-screen h-screen" ref={ref}>
                {!isLoading && (
                    <>
                        <Link
                            href={
                                previousChapterID
                                    ? `/chapter/${previousChapterID}/${previousChapterPages}`
                                    : `/manga/${mangaID}`
                            }
                            className="absolute h-full w-[50%] cursor-pointer z-1 left-0"
                            onClick={(e) => {
                                if (page - 1 < 0 && !aggregateData) return;
                                if (page - 1 < 0) return;
                                e.preventDefault();

                                setPage(page - 1);
                                window.history.replaceState(
                                    null,
                                    ``,
                                    `${page}`
                                );
                                window.scrollTo({ top: ref.current.offsetTop });
                            }}
                            prefetch={true}
                        ></Link>

                        <Link
                            href={
                                nextChapterID !== ""
                                    ? `/chapter/${nextChapterID}/1`
                                    : `/manga/${mangaID}`
                            }
                            className="absolute h-full w-[50%] cursor-pointer z-1 left-[50%]"
                            onClick={(e) => {
                                if (
                                    page + 1 >
                                        atHomeData.chapter.data.length - 1 &&
                                    !aggregateData
                                )
                                    return;
                                if (
                                    page + 1 >
                                    atHomeData.chapter.data.length - 1
                                )
                                    return;
                                e.preventDefault();

                                setPage(page + 1);
                                window.history.replaceState(
                                    null,
                                    ``,
                                    `${page + 2}`
                                );
                                window.scrollTo({ top: ref.current.offsetTop });
                            }}
                            prefetch={true}
                        ></Link>
                        <div className="flex items-center justify-center absolute z-1 bottom-[-95px] left-[50%] translate-x-[-50%]">
                            {atHomeData !== undefined && (
                                <Progress
                                    value={
                                        atHomeData !== undefined
                                            ? ((page + 1) * 100) /
                                              atHomeData.chapter.data.length
                                            : 0
                                    }
                                    className={cn(
                                        "w-[95vw] h-[5px] transition-opacity ease-in-out delay-50 duration-300",
                                        {
                                            "opacity-0": isProgressHidden,
                                            "opacity-100": !isProgressHidden,
                                        }
                                    )}
                                />
                            )}
                        </div>

                        {atHomeData !== undefined && (
                            <div className="flex items-center justify-center">
                                {atHomeData.chapter.data.map(
                                    (filename, index) => {
                                        const host = atHomeData.baseUrl;
                                        const hash = atHomeData.chapter.hash;

                                        return (
                                            <Image
                                                className={cn(
                                                    "h-screen w-auto",
                                                    {
                                                        "visually-hidden":
                                                            index !== page,
                                                    }
                                                )}
                                                src={`${host}/data/${hash}/${filename}`}
                                                key={index}
                                                alt={`page ${page + 1}`}
                                                width={0}
                                                height={0}
                                                sizes="100vh"
                                                priority={true}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
