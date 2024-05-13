import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function RecentlyUpdated() {
    const response = await fetch(
        `https://api.mangadex.org/manga?order[createdAt]=desc&limit=6&includes[]=cover_art`,
        {
            cache: "no-store",
        }
    );
    const data = await response.json();
    console.log(response);

    return (
        <div>
            <Card>
                <CardContent className="p-5">
                    <h3 className="font-semibold text-lg pb-3">
                        Recently Updated Titles
                    </h3>
                    <div className="grid grid-cols-6 w-full gap-3">
                        {data.data.map((element, index) => {
                            const mangaId = element.id;
                            const mangaTitle =
                                element.attributes.title.en ??
                                element.attributes.title["ja-ro"] ??
                                element.attributes.title.ja;
                            const coverFileName = element.relationships.filter(
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
                                            objectFit="cover"
                                        />
                                        <p className="text-[14px] font-medium">
                                            {`${mangaTitle.substr(0, 50)}` +
                                                (mangaTitle.length > 50
                                                    ? "..."
                                                    : "")}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
