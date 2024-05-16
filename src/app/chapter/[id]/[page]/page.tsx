"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const fetchAtHome = async (chapterID: string) => {
    const response = await fetch(
        `https://api.mangadex.org/at-home/server/${chapterID}`
    );
    const data = await response.json();

    return data;
};

const fetchChapter = async (chapterID: string) => {
    const response = await fetch(
        `https://api.mangadex.org/chapter/${chapterID}?includes[]=manga`
    );
    const data = await response.json();

    return data;
};

const fetchAggregate = async (
    mangaID: string,
    translatedLanguage: string[]
) => {
    const response = await fetch(
        `https://api.mangadex.org/manga/${mangaID}/aggregate?translatedLanguage[]=${translatedLanguage}`
    );
    const data = await response.json();

    return data;
};

export default function ChapterPage({
    params,
}: {
    params: { id: string; page: number };
}) {
    const [page, setPage] = useState<number>(0);
    const [isProgressHidden, setIsProgressHidden] = useState<boolean>(false);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

    const [mangaID, setMangaID] = useState<string>("");

    const [translatedLanguage, setTranslatedLanguage] = useState<string[]>([
        "",
    ]);
    const [chapter, setChapter] = useState<string>("");
    const [volume, setVolume] = useState<string>("");

    const [previousChapterID, setPreviousChapterID] = useState<string>("");
    const [nextChapterID, setNextChapterID] = useState<string>("");

    const [aggregate, setAggregate] = useState<[]>([]);
    const [aggregateIndex, setAggregateIndex] = useState<number>(-1);

    const router = useRouter();

    const { data: atHomeData } = useQuery({
        enabled: !!params.id,
        queryKey: ["atHome", params.id],
        queryFn: () => fetchAtHome(params.id),
        refetchOnWindowFocus: false,
    });

    const { data: chapterData } = useQuery({
        enabled: !!params.id,
        queryKey: ["chapter", params.id],
        queryFn: () => fetchChapter(params.id),
        refetchOnWindowFocus: false,
    });

    const { data: aggregateData } = useQuery({
        enabled: !!mangaID,
        queryKey: ["aggregate", mangaID],
        queryFn: () => fetchAggregate(mangaID, translatedLanguage),
        refetchOnWindowFocus: false,
    });

    // hide progress bar within n milliseconds
    // useEffect(() => {
    //     if (isTimerActive) return;

    //     setIsProgressHidden(false);

    //     setIsTimerActive(true);
    //     setTimeout(() => {
    //         setIsProgressHidden(true);
    //         setIsTimerActive(false);
    //     }, 1500);
    // }, [page]);

    console.log(nextChapterID);

    useEffect(() => {
        setPage(params.page - 1);
    }, []);

    // get manga id
    useEffect(() => {
        if (chapterData === undefined) return;

        setMangaID(
            chapterData.data.relationships.filter((rel: { type: string }) => {
                return rel.type == "manga";
            })[0].id
        );
        setVolume(chapterData.data.attributes.volume);
        setChapter(chapterData.data.attributes.chapter);
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

        const next = aggregate[aggregateIndex + 1];
        const prev = aggregate[aggregateIndex - 1];

        setNextChapterID(prev ? next.chapterID : "");
        setPreviousChapterID(next ? prev.chapterID : "");
    }, [aggregateIndex]);

    return (
        <div className="w-screen h-screen">
            {/* previous page area */}
            <Link
                href={
                    previousChapterID
                        ? `/chapter/${previousChapterID}`
                        : `/manga/${mangaID}`
                }
                className="absolute h-full w-[50%] cursor-pointer z-1 left-0"
                onClick={(e) => {
                    if (page - 1 < 0 && !aggregateData) return;
                    if (page - 1 < 0) return;
                    e.preventDefault();

                    setPage(page - 1);
                    window.history.pushState(null, ``, `${page}`);
                }}
            ></Link>
            {/* next page area */}
            <Link
                href={
                    nextChapterID
                        ? `/chapter/${nextChapterID}/1`
                        : `/manga/${mangaID}`
                }
                className="absolute h-full w-[50%] cursor-pointer z-1 left-[50%]"
                onClick={(e) => {
                    if (
                        page + 1 > atHomeData.chapter.data.length - 1 &&
                        !aggregateData
                    )
                        return;
                    if (page + 1 > atHomeData.chapter.data.length - 1) return;
                    e.preventDefault();

                    setPage(page + 1);
                    window.history.pushState(null, ``, `${page + 2}`);
                }}
            ></Link>
            <div className="flex items-center justify-center absolute z-1 bottom-[5px] left-[50%] translate-x-[-50%]">
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
                        onChange={() => {}}
                    />
                )}
            </div>

            {atHomeData !== undefined && (
                <div className="flex items-center justify-center">
                    {atHomeData.chapter.data.map((filename, index) => {
                        const host = atHomeData.baseUrl;
                        const hash = atHomeData.chapter.hash;

                        return (
                            <Image
                                className={cn("h-screen w-auto", {
                                    "visually-hidden": index !== page,
                                })}
                                src={`${host}/data/${hash}/${filename}`}
                                key={index}
                                alt={`page ${page + 1}`}
                                width={0}
                                height={0}
                                sizes="100vh"
                                priority={true}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
