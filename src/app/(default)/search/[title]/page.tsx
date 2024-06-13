"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { fetchMangaByTitle } from "@/api/manga";

export default function SearchResults() {
    const params = useParams<{ title: string }>();

    // const { updateFetchSubmit } = useSearchStore();

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
                <Skeleton className="hidden min-w-[256px] h-[400px] md:inline" />
                <div className="flex flex-col gap-3 w-full">
                    <Skeleton className="w-full h-[24px] md:w-[400px]" />
                    <Skeleton className="h-[200px] w-[100%]" />
                </div>
            </div>
        );
    }

    if (isLoading) {
        return skeletons;
    }

    if (!searchData.data.length) {
        return (
            <div className="w-full flex items-center justify-center italic pt-3">
                No Manga Found :( Try to Submit Another Title
            </div>
        );
    }

    return (
        <main className="overflow-auto">
            <div className="md:flex md:flex-col gap-3">
                {searchData !== undefined &&
                    searchData.data.map((manga, index) => {
                        const mangaId = manga.id;
                        const mangaTitle =
                            manga.attributes.title[
                                Object.keys(manga.attributes.title)[0]
                            ];
                        const coverFileName = manga.relationships.filter(
                            (rel: { type: string }) => {
                                return rel.type == "cover_art";
                            }
                        )[0].attributes?.fileName;
                        const coverUrl = `https://uploads.mangadex.org/covers/${mangaId}/${coverFileName}.512.jpg`;

                        return (
                            <Link
                                key={index}
                                href={`/manga/${mangaId}`}
                                className="flex p-3 gap-5"
                            >
                                <Image
                                    className="hidden rounded-md min-w-[256px] md:inline"
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
                                        {manga.attributes.description.en ??
                                            manga.attributes.description[
                                                Object.keys(
                                                    manga.attributes.description
                                                )[0]
                                            ]}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </main>
    );
}
