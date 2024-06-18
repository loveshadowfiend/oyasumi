import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { getRuTitle } from "@/lib/utils";

export default async function SearchResults({
    params,
}: {
    params: { title: string };
}) {
    const results = await fetch(
        `https://api.mangadex.org/manga?title=${params.title}&includes[]=cover_art&order[relevance]=desc`
    ).then((res) => res.json());

    if (!results.data.length) {
        return (
            <div className="w-full flex items-center justify-center italic pt-3">
                Ничего не найдено по вашему запросу
            </div>
        );
    }

    return (
        <main className="overflow-auto">
            <div className="md:flex md:flex-col gap-3">
                {results !== undefined &&
                    results.data.map((manga, index) => {
                        const mangaId = manga.id;
                        let mangaTitle = getRuTitle(manga.attributes.altTitles);

                        if (mangaTitle === undefined) {
                            mangaTitle =
                                manga.attributes.title.en ??
                                manga.attributes.title.ja ??
                                manga.attributes.title["ja-ro"] ??
                                manga.attributes.title[
                                    Object.keys(manga.data.attributes.title)[0]
                                ];
                        }
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
                                className="flex p-3 gap-5 max-h-[400px]"
                            >
                                <Image
                                    className="object-cover max-h-[400px] hidden rounded-md min-w-[256px] md:inline"
                                    src={coverUrl}
                                    alt={`${mangaTitle} cover`}
                                    width={256}
                                    height={400}
                                ></Image>
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-2xl font-semibold">
                                        {mangaTitle}
                                    </h3>
                                    <Markdown className="overflow-hidden">
                                        {manga.attributes.description.ru ??
                                            manga.attributes.description.en ??
                                            manga.attributes.description[
                                                Object.keys(
                                                    manga.attributes.description
                                                )[0]
                                            ]}
                                    </Markdown>
                                </div>
                            </Link>
                        );
                    })}
            </div>
        </main>
    );
}
