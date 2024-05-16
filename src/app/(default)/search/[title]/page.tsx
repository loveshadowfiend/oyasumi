"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import useSearchStore from "@/stores/searchStore";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const fetchMangaByTitle = async (title: string) => {
    const response = await fetch(
        `https://api.mangadex.org/manga?title=${title}&includes[]=cover_art&order[relevance]=desc`
    );

    const data = await response.json();

    return data;
};

export default function SearchResults() {
    const params = useParams<{ title: string }>();

    const { updateFetchSubmit } = useSearchStore();

    const { data: searchData, isLoading } = useQuery({
        enabled: !!params.title,
        queryKey: ["manga", params.title],
        queryFn: () => fetchMangaByTitle(params.title),
        refetchOnWindowFocus: false,
    });

    let skeletons = [];
    for (let i = 0; i < 10; i++) {
        skeletons.push(
            <div className="flex gap-5 p-3">
                <Skeleton className="min-w-[256px] h-[400px]" />
                <div className="flex flex-col gap-3 w-full">
                    <Skeleton className="h-[24px] w-[400px]" />
                    <Skeleton className="h-[200px] w-[100%]" />
                </div>
            </div>
        );
    }

    return (
        <main className="overflow-auto">
            <div className="flex flex-col gap-3">
                {searchData !== undefined &&
                    searchData.data.map((manga, index) => {
                        const mangaId = manga.id;
                        const mangaTitle =
                            manga.attributes.title.en ??
                            manga.attributes.title["ja-ro"] ??
                            manga.attributes.title.ja;
                        const coverFileName = manga.relationships.filter(
                            (rel: { type: string }) => {
                                return rel.type == "cover_art";
                            }
                        )[0].attributes?.fileName;
                        const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}.512.jpg`;

                        return (
                            <Link key={index} href={`/manga/${mangaId}`}>
                                <Card>
                                    <CardContent className="flex p-3 gap-5">
                                        <Image
                                            className="rounded-md min-w-[256px]"
                                            src={coverUrl}
                                            alt={`${mangaTitle} cover`}
                                            width={256}
                                            height={360}
                                        ></Image>
                                        <div className="flex flex-col gap-3">
                                            <h3 className="text-2xl font-semibold">
                                                {mangaTitle}
                                            </h3>
                                            <p className="text-justify">
                                                {
                                                    manga.attributes.description
                                                        .en
                                                }
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                {isLoading && skeletons}
            </div>
        </main>
    );
}
