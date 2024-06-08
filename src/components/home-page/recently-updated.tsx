"use client";

import { fetchRecentlyUpdated } from "@/api/manga";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import Link from "next/link";

export default function RecentlyUpdated() {
    const { data, isLoading } = useQuery({
        queryKey: ["recentlyUpdated"],
        queryFn: () => fetchRecentlyUpdated(),
    });

    return (
        <div>
            <h3 className="font-semibold text-lg pb-3">
                Recently Updated Titles
            </h3>
            <div className="grid grid-cols-2 w-full gap-3 md:grid-cols-6">
                {isLoading && (
                    // TODO: kill this with fire
                    <>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[200px] h-[255px]" />
                            <Skeleton className="w-full h-[20px]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[200px] h-[255px]" />
                            <Skeleton className="w-full h-[20px]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[200px] h-[255px]" />
                            <Skeleton className="w-full h-[20px]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[200px] h-[255px]" />
                            <Skeleton className="w-full h-[20px]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[200px] h-[255px]" />
                            <Skeleton className="w-full h-[20px]" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[200px] h-[255px]" />
                            <Skeleton className="w-full h-[20px]" />
                        </div>
                    </>
                )}
                {!isLoading &&
                    data.data.map((manga, index) => {
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
                            <Link key={index} href={`manga/${mangaId}`}>
                                <div className="flex flex-col gap-1">
                                    <Image
                                        className="object-cover w-[200px] h-[255px] rounded-md"
                                        src={coverUrl}
                                        alt={`${mangaTitle} cover`}
                                        width={200}
                                        height={255}
                                    />
                                    <p className="text-[14px] font-medium">
                                        {`${mangaTitle.substr(0, 40)}` +
                                            (mangaTitle.length > 40
                                                ? "..."
                                                : "")}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </div>
    );
}
