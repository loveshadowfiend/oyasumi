import { Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChaptersFeed } from "@/components/manga-page/chapters-feed";
import type { Metadata, ResolvingMetadata } from "next";
import { AddToLibraryButton } from "@/components/manga-page/add-to-library-button";
import Markdown from "react-markdown";

type Props = {
    params: { id: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const manga = await fetch(
        `https://api.mangadex.org/manga/${params.id}?includes[]=cover_art`
    ).then((res) => res.json());

    return {
        title:
            manga.data.attributes.title.en ??
            manga.data.attributes.title.ja ??
            manga.data.attributes.title["ja-ro"] ??
            manga.data.attributes.title[
                Object.keys(manga.data.attributes.title)[0]
            ],
        description:
            manga.data.attributes.description.en ??
            manga.data.attributes.description.ja ??
            manga.data.attributes.description["ja-ro"] ??
            manga.data.attributes.description[
                Object.keys(manga.data.attributes.description)[0]
            ],
    };
}

export default async function MangaPage({
    params,
}: {
    params: { id: string };
}) {
    const mangaData = await fetch(
        `https://api.mangadex.org/manga/${params.id}?includes[]=cover_art`
    ).then((res) => res.json());

    const coverFileName =
        mangaData.data.relationships.filter((rel: { type: string }) => {
            return rel.type == "cover_art";
        })[0].attributes?.fileName ?? "";

    const coverUrl = `https://uploads.mangadex.org/covers/${mangaData.data.id}/${coverFileName}.512.jpg`;

    const statisticsResponse = await fetch(
        `https://api.mangadex.org/statistics/manga/${params.id}`
    );

    const statisticsData = await statisticsResponse.json();

    return (
        <main className="flex gap-10">
            <div className="flex flex-col w-[300px] gap-3">
                <Image
                    className="rounded-md"
                    src={coverUrl}
                    width={300}
                    height={400}
                    alt={`${mangaData.data.attributes.title.en}`}
                />
                <AddToLibraryButton />
                <Card>
                    <CardContent className="flex flex-col gap-3 p-3 text-sm">
                        <div>
                            <p>Year</p>
                            <p className="capitalize">
                                {mangaData.data.attributes.year}
                            </p>
                        </div>
                        <div>
                            <p className="">Status</p>
                            <p className="capitalize">
                                {mangaData.data.attributes.status}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col w-full gap-3">
                <div className="flex min-h-[36px] w-full items-center justify-between">
                    <h2 className="text-4xl font-bold">
                        {mangaData.data.attributes.title.en ??
                            mangaData.data.attributes.title.ja ??
                            mangaData.data.attributes.title["ja-ro"] ??
                            mangaData.data.attributes.title[
                                Object.keys(mangaData.data.attributes.title)[0]
                            ]}
                    </h2>
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
                    <Markdown>
                        {mangaData.data.attributes.description.en ??
                            mangaData.data.attributes.description.ja ??
                            mangaData.data.attributes.description["ja-ro"] ??
                            mangaData.data.attributes.description[
                                Object.keys(mangaData.data.attributes.title)[0]
                            ]}
                    </Markdown>
                </div>
                <div>
                    <ChaptersFeed mangaID={params.id} />
                </div>
            </div>
        </main>
    );
}
