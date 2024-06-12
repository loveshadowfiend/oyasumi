"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

import Image from "next/image";
import Link from "next/link";
import { fetchAggregate, fetchAtHome, fetchChapter } from "@/api/chapter";
import useChapterStore from "@/stores/chapterStore";
import { ChapterHeader } from "@/components/chapter-page/chapter-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChapterPage({
    params,
}: {
    params: { id: string; page: number };
}) {
    const {
        mangaID,
        nextChapterLink,
        previousChapterLink,
        updateChapter,
        updateNextLink,
        updatePreviousLink,
    } = useChapterStore();

    const [translatedLanguage, setTranslatedLanguage] = useState(["en"]);

    const [page, setPage] = useState<number>(0);
    const [isProgressHidden, setIsProgressHidden] = useState<boolean>(false);

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

    const { data: nextChapterData, isLoading: isNextChapterLoading } = useQuery(
        {
            enabled: !!nextChapterID,
            queryKey: ["nextChapter", nextChapterID],
            queryFn: () => fetchChapter(nextChapterID),
            refetchOnWindowFocus: false,
        }
    );

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
        if (ref === null || ref.current === null) return;

        window.scrollTo({ top: ref.current.offsetTop });
    }, [ref, isLoading]);

    // get manga id and translated langauge
    useEffect(() => {
        if (chapterData === undefined) return;

        const _manga = chapterData.data.relationships.filter(
            (rel: { type: string }) => {
                return rel.type == "manga";
            }
        )[0];

        updateChapter(
            _manga.id,
            _manga.attributes.title[Object.keys(_manga.attributes.title)[0]],
            chapterData.data.attributes.chapter
        );

        setTranslatedLanguage(chapterData.data.attributes.translatedLanguage);
    }, [chapterData, updateChapter, isLoading]);

    // logic to get the list of chapters
    useEffect(() => {
        if (isLoading || aggregateData === undefined) return;

        let _aggregate = [];
        let chapters = new Set();

        Object.keys(aggregateData.volumes).map((volumeKey) => {
            Object.keys(aggregateData.volumes[volumeKey].chapters).map(
                (chapterKey) => {
                    const chapterID =
                        aggregateData.volumes[volumeKey].chapters[chapterKey]
                            .id;

                    if (!chapters.has(chapterKey)) {
                        chapters.add(chapterKey);
                        _aggregate.push({
                            volume: volumeKey,
                            chapter: chapterKey,
                            chapterID: chapterID,
                        });
                    }
                }
            );
        });

        _aggregate = _aggregate.reverse();
        setAggregate(_aggregate);

        _aggregate.forEach((chapter, index) => {
            if (chapterData.data.attributes.chapter === chapter.chapter) {
                setAggregateIndex(index);
            }
        });
    }, [aggregateData, chapterData, isLoading, params.id]);

    // logic to get next/previous chapter link
    useEffect(() => {
        if (!aggregate.length || aggregateIndex === -1) return;

        const next = aggregate[aggregateIndex - 1];
        const prev = aggregate[aggregateIndex + 1];

        setNextChapterID(next ? next.chapterID : "");
        setPreviousChapterID(prev ? prev.chapterID : "");

        updateNextLink(
            next ? `/chapter/${next.chapterID}/1` : `/manga/${mangaID}`
        );
    }, [aggregate, aggregateIndex, mangaID, updateNextLink]);

    useEffect(() => {
        if (previousChapterData !== undefined) {
            const _previousChapterPages =
                previousChapterData.data.attributes.pages;
            setPreviousChapterPages(_previousChapterPages);

            updatePreviousLink(
                `/chapter/${previousChapterID}/${_previousChapterPages}`
            );
        }
    }, [
        previousChapterData,
        nextChapterData,
        nextChapterID,
        previousChapterID,
        updatePreviousLink,
    ]);

    // toggle loading state
    useEffect(() => {
        if (
            !isAggregateLoading &&
            !isAtHomeLoading &&
            !isChapterLoading &&
            !isPreviousChapterLoading &&
            !isNextChapterLoading
        ) {
            setIsLoading(false);
        }
    }, [
        isAggregateLoading,
        isAtHomeLoading,
        isChapterLoading,
        isPreviousChapterLoading,
        isNextChapterLoading,
    ]);

    if (isLoading)
        return (
            <>
                <div className="flex w-screen items-center justify-center">
                    <Skeleton className="h-screen w-[700px]" />
                </div>
            </>
        );

    console.log(aggregate);
    console.log(aggregateIndex);
    console.log(translatedLanguage);
    console.log(chapterData.data.attributes.chapter);

    return (
        <>
            <ChapterHeader />
            <main>
                <div className="max-w-screen min-h-screen" ref={ref}>
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
                                    window.scrollTo({
                                        top: ref.current.offsetTop,
                                    });
                                }}
                            />

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
                                            atHomeData.chapter.data.length -
                                                1 &&
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
                                    window.scrollTo({
                                        top: ref.current.offsetTop,
                                    });
                                }}
                            />

                            <div className="fixed inset-x-0 max-w-max mx-auto bottom-2">
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
                            </div>

                            {atHomeData !== undefined && (
                                <div className="flex items-center justify-center w-full">
                                    {atHomeData.chapter.data.map(
                                        (filename, index) => {
                                            const host = atHomeData.baseUrl;
                                            const hash =
                                                atHomeData.chapter.hash;

                                            return (
                                                <Image
                                                    className={cn(
                                                        "h-screen w-auto object-contain",
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
                                                    placeholder="empty"
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
        </>
    );
}
