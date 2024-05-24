"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect } from "react";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularNewTitles } from "@/api/manga";

export default function PopularNewTitles() {
    const { data, isLoading } = useQuery({
        queryKey: ["popularNewTitles"],
        queryFn: () => fetchPopularNewTitles(),
        refetchOnWindowFocus: false,
    });

    const imageWidth = 250,
        imageHeight = 355;

    if (isLoading) return <Skeleton className={`w-full h-[355px]`} />;

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* <h3 className="font-semibold text-lg">Popular New Titles</h3> */}
            <Carousel
                className="flex items-center justify-center"
                plugins={[
                    Autoplay({
                        delay: 4000,
                    }),
                ]}
            >
                <CarouselContent>
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
                                <CarouselItem key={index}>
                                    <Link href={`manga/${mangaId}`}>
                                        <div className="flex gap-5">
                                            <Image
                                                className={`object-cover w-[250px] h-[355px] rounded-md`}
                                                src={coverUrl}
                                                alt={`${mangaTitle} cover`}
                                                width={imageWidth}
                                                height={imageHeight}
                                            />
                                            <div className="flex flex-col gap-3">
                                                <p className="text-4xl font-semibold">
                                                    {mangaTitle}
                                                </p>
                                                <p className="text-sm">
                                                    {
                                                        manga.attributes
                                                            .description.en
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            );
                        })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
