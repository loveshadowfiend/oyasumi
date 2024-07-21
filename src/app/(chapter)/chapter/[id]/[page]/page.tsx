"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { fetchAggregate, fetchAtHome, fetchChapter } from "@/api/chapter";
import useChapterStore from "@/stores/chapterStore";
import { ChapterHeader } from "@/components/chapter-page/chapter-header";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname, useRouter } from "next/navigation";
import useLatestMangaStore from "@/stores/latestMangaStore";
import useChapterSettingsStore from "@/stores/chapterSettingsStore";
import { fetchMangaByID } from "@/api/manga";
import { Button } from "@/components/ui/button";
import { getRuTitle } from "@/lib/utils";

export default function ChapterPage({
    params,
}: {
    params: { id: string; page: number };
}) {
    const router = useRouter();

    const {
        mangaID,
        nextChapterLink,
        previousChapterLink,
        updateChapter,
        updateNextLink,
        updatePreviousLink,
    } = useChapterStore();

    const { fit, containerWidth, server } = useChapterSettingsStore();

    const { updateLatestPage, updateLatestMangas } = useLatestMangaStore();
    const { isProgressActive } = useChapterSettingsStore();

    const [translatedLanguage, setTranslatedLanguage] = useState(["ru"]);

    const [page, setPage] = useState<number>(0);
    const [isProgressHidden, setIsProgressHidden] = useState<boolean>(false);

    const [previousChapterID, setPreviousChapterID] = useState<string>("");
    const [nextChapterID, setNextChapterID] = useState<string>("");
    const [previousChapterPages, setPreviousChapterPages] = useState<number>(0);

    const [aggregate, setAggregate] = useState<[]>([]);
    const [aggregateIndex, setAggregateIndex] = useState<number>(-1);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const ref = useRef(null);

    const pathname = usePathname();

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

    const { data: mangaData, isLoading: isMangaLoading } = useQuery({
        enabled: !!mangaID,
        queryKey: ["manga", mangaID],
        queryFn: () => fetchMangaByID(mangaID),
        refetchOnWindowFocus: false,
    });

    const prevPage = useCallback(() => {
        if (page - 1 < 0) {
            router.push(previousChapterLink, {
                scroll: false,
            });
            return;
        }

        setPage(page - 1);
        window.history.replaceState(null, ``, `${page}`);
        window.scrollTo({
            top: ref.current.offsetTop,
        });
    }, [page, previousChapterLink, router]);

    const nextPage = useCallback(() => {
        if (page + 1 > atHomeData.chapter.data.length - 1) {
            router.push(nextChapterLink, {
                scroll: false,
            });
            return;
        }

        setPage(page + 1);
        window.history.replaceState(null, ``, `${page + 2}`);
        window.scrollTo({
            top: ref.current.offsetTop,
        });
    }, [atHomeData, nextChapterLink, page, router]);

    useEffect(() => {
        setPage(params.page - 1);
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    prevPage();
                    break;
                case "ArrowRight":
                    nextPage();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [isLoading, nextPage, page, prevPage]);

    useEffect(() => {
        if (!atHomeData) return;

        if (params.page - 1 > atHomeData.chapter.data.length) {
            router.push(
                `/chapter/${params.id}/${atHomeData.chapter.data.length}`,
                {
                    scroll: false,
                }
            );
        } else if (params.page - 1 <= 0) {
            router.push(`/chapter/${params.id}/1`, {
                scroll: false,
            });
        }
    }, [atHomeData]);

    useEffect(() => {
        if (isLoading) return;

        updateLatestPage(mangaID, pathname);
    }, [page, pathname, updateLatestPage, isLoading, mangaID]);

    useEffect(() => {
        setIsProgressHidden(false);

        const timeout = setTimeout(() => {
            setIsProgressHidden(true);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [page]);

    useEffect(() => {
        if (isLoading || ref.current === null) return;

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

        let mangaTitle = getRuTitle(_manga.attributes.altTitles);

        if (mangaTitle === undefined) {
            mangaTitle =
                _manga.attributes.title.en ??
                _manga.attributes.title.ja ??
                _manga.attributes.title["ja-ro"] ??
                _manga.attributes.title[
                    Object.keys(mangaData.data.attributes.title)[0]
                ];
        }

        updateChapter(
            _manga.id,
            mangaTitle,
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

        const nextLink = next
            ? `/chapter/${next.chapterID}/1`
            : `/manga/${mangaID}`;

        updateNextLink(nextLink);
        router.prefetch(nextLink);

        if (prev === undefined) {
            updatePreviousLink(`/manga/${mangaID}`);
        }
    }, [
        aggregate,
        aggregateIndex,
        mangaID,
        router,
        updateNextLink,
        updatePreviousLink,
    ]);

    useEffect(() => {
        if (!previousChapterData) return;

        const _previousChapterPages = previousChapterData.data.attributes.pages;
        setPreviousChapterPages(_previousChapterPages);

        const prevLink = `/chapter/${previousChapterID}/${_previousChapterPages}`;

        updatePreviousLink(prevLink);
        router.prefetch(prevLink);
    }, [
        isLoading,
        nextChapterData,
        nextChapterID,
        previousChapterID,
        updatePreviousLink,
        mangaID,
        router,
        previousChapterData,
    ]);

    useEffect(() => {
        if (isLoading || !mangaData) return;

        const coverFileName =
            mangaData.data.relationships.filter((rel: { type: string }) => {
                return rel.type == "cover_art";
            })[0].attributes?.fileName ?? "";

        const coverUrl = `https://uploads.mangadex.org/covers/${mangaData.data.id}/${coverFileName}.512.jpg`;

        let mangaTitle = getRuTitle(mangaData.data.attributes.altTitles) ?? "";

        if (mangaTitle === undefined) {
            mangaTitle =
                mangaData.data.attributes.title.en ??
                mangaData.data.attributes.title.ja ??
                mangaData.data.attributes.title["ja-ro"] ??
                mangaData.data.attributes.title[
                    Object.keys(mangaData.data.attributes.title)[0]
                ];
        }

        updateLatestMangas(mangaID, pathname, mangaTitle, coverUrl);
    }, [isLoading, mangaData, mangaID, pathname, updateLatestMangas]);

    // toggle loading state
    useEffect(() => {
        if (
            !isAggregateLoading &&
            !isAtHomeLoading &&
            !isChapterLoading &&
            !isPreviousChapterLoading &&
            !isNextChapterLoading &&
            !isMangaLoading
        ) {
            setIsLoading(false);
        }
    }, [
        isAggregateLoading,
        isAtHomeLoading,
        isChapterLoading,
        isPreviousChapterLoading,
        isNextChapterLoading,
        isMangaLoading,
    ]);

    if (isLoading)
        return (
            <div className="flex w-screen items-center justify-center">
                <Skeleton className="h-[80vh] w-screen md:w-[40vw] md:h-screen" />
            </div>
        );

    if (chapterData.data.attributes.externalUrl) {
        return (
            <>
                <ChapterHeader />
                <div className="w-screen h-[80vh]">
                    <div className="flex flex-col w-full h-full items-center justify-center gap-3">
                        <p>Эта глава доступна только на другом сайте</p>
                        <Button>
                            <Link
                                href={chapterData.data.attributes.externalUrl}
                            >
                                Перейти
                            </Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <ChapterHeader className="z-50 max-w-screen" />
            <main className="h-full max-w-screen">
                <div className="relative h-full min-h-screen" ref={ref}>
                    <div
                        className="absolute h-full w-[50%] cursor-pointer z-1 left-0"
                        onClick={(e) => {
                            e.preventDefault();

                            prevPage();
                        }}
                    />
                    <div
                        className="absolute h-full w-[50%] cursor-pointer z-1 left-[50%]"
                        onClick={(e) => {
                            e.preventDefault();

                            nextPage();
                        }}
                    />

                    <div
                        className={cn(
                            "fixed inset-x-0 max-w-max mx-auto bottom-2",
                            { hidden: !isProgressActive }
                        )}
                    >
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
                        <div
                            className={cn(
                                `flex items-center justify-center w-full`
                            )}
                        >
                            {atHomeData.chapter[server].map(
                                (filename: string, index: number) => {
                                    const host = atHomeData.baseUrl;
                                    const hash = atHomeData.chapter.hash;

                                    const widthProperty =
                                        fit === "width"
                                            ? `w-[${containerWidth}]`
                                            : "";

                                    return (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            className={cn(
                                                `object-contain ${widthProperty}`,
                                                {
                                                    "visually-hidden":
                                                        index !== page,
                                                    "h-screen":
                                                        fit === "height",
                                                }
                                            )}
                                            src={`/api/image?url=${host}/${
                                                server === "data"
                                                    ? "data"
                                                    : "data-saver"
                                            }/${hash}/${filename}`}
                                            key={index}
                                            alt={`page ${page + 1}`}
                                        />
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
