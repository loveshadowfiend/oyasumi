import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ChaptersFeed } from "@/components/ChaptersFeed";

export default async function MangaPage({
    params,
}: {
    params: { id: string };
}) {
    const mangaResponse = await fetch(
        `https://api.mangadex.org/manga/${params.id}?includes[]=cover_art`
    );
    const mangaData = await mangaResponse.json();

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
                <Button className="w-full">Add to Library</Button>
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
                            mangaData.data.attributes.title["ja-ro"]}
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
                    <p className="text-justify">
                        {mangaData.data.attributes.description.en}
                    </p>
                </div>
                <div>
                    <ChaptersFeed mangaID={params.id} />
                </div>
            </div>
        </main>
    );
}
