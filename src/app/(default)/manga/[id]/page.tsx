import { Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChaptersFeed } from "@/components/manga-page/chapters-feed";
import type { Metadata, ResolvingMetadata } from "next";
import { ReadingButton } from "@/components/manga-page/reading-button";
import Markdown from "react-markdown";
import { getRuTitle } from "@/utils/manga";
import { ClearHistory } from "@/components/manga-page/clear-history";
import { STATUS } from "@/constants/manga";

type Props = {
    params: { id: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const manga = await fetch(
        `/api/manga/${params.id}?includes[]=cover_art`
    ).then((res) => res.json());

    let mangaTitle = getRuTitle(manga.data.attributes.altTitles);

    if (mangaTitle === undefined) {
        mangaTitle =
            manga.data.attributes.title.en ??
            manga.data.attributes.title.ja ??
            manga.data.attributes.title["ja-ro"] ??
            manga.data.attributes.title[
                Object.keys(manga.data.attributes.title)[0]
            ];
    }

    const mangaDescription =
        manga.data.attributes.description.ru ??
        manga.data.attributes.description.en ??
        manga.data.attributes.description.ja ??
        manga.data.attributes.description["ja-ro"] ??
        manga.data.attributes.description[
            Object.keys(manga.data.attributes.description)[0]
        ];

    return {
        title: mangaTitle,
        description: mangaDescription,
    };
}

export default async function MangaPage({
    params,
}: {
    params: { id: string };
}) {
    const manga = await fetch(
        `/api/manga/${params.id}?includes[]=cover_art`
    ).then((res) => res.json());

    let mangaTitle = getRuTitle(manga.data.attributes.altTitles);

    if (mangaTitle === undefined) {
        mangaTitle =
            manga.data.attributes.title.en ??
            manga.data.attributes.title.ja ??
            manga.data.attributes.title["ja-ro"] ??
            manga.data.attributes.title[
                Object.keys(manga.data.attributes.title)[0]
            ];
    }

    const mangaDescription =
        manga.data.attributes.description.ru ??
        manga.data.attributes.description.en ??
        manga.data.attributes.description.ja ??
        manga.data.attributes.description["ja-ro"] ??
        manga.data.attributes.description[
            Object.keys(manga.data.attributes.description)[0]
        ];

    const coverFileName =
        manga.data.relationships.filter((rel: { type: string }) => {
            return rel.type == "cover_art";
        })[0].attributes?.fileName ?? "";

    const coverURL = `https://uploads.mangadex.org/covers/${manga.data.id}/${coverFileName}.512.jpg`;

    const statisticsResponse = await fetch(
        `https://api.mangadex.org/statistics/manga/${params.id}`
    );

    const statisticsData = await statisticsResponse.json();

    return (
        <main className="grid grid-cols-flow place-items-center gap-10 md:flex md:flex-row md:place-items-start">
            <div className="flex flex-col gap-3 w-full md:w-[300px]">
                <Image
                    className="rounded-md w-auto"
                    src={coverURL}
                    width={300}
                    height={400}
                    alt={`${mangaTitle} cover`}
                />
                <ReadingButton mangaID={params.id} />
                <Card>
                    <CardContent className="flex flex-col gap-3 p-3 text-sm">
                        <div>
                            <p>Год</p>
                            <p className="capitalize">
                                {manga.data.attributes.year}
                            </p>
                        </div>
                        <div>
                            <p className="">Статус</p>
                            <p className="capitalize">
                                {STATUS.get(manga.data.attributes.status) ??
                                    manga.data.attributes.status}
                            </p>
                        </div>
                        <div className="pt-3">
                            <ClearHistory mangaID={params.id} />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col w-full gap-3">
                <div className="flex min-h-[36px] w-full items-center justify-between">
                    <h2 className="text-4xl font-bold">{mangaTitle}</h2>
                    <div className="flex gap-1 items-center">
                        <Star />
                        <p className="font-semibold text-lg">
                            {Math.round(
                                Number(
                                    statisticsData.statistics[`${params.id}`]
                                        .rating.average
                                ) * 100
                            ) / 100}
                        </p>
                    </div>
                </div>
                <div>
                    <Markdown>{mangaDescription}</Markdown>
                </div>
                <div>
                    <ChaptersFeed mangaID={params.id} />
                </div>
            </div>
        </main>
    );
}
