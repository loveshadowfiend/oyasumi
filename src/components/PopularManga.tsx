import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default async function PopularManga() {
    const response = await fetch(
        "https://api.mangadex.org/manga?order[followedCount]=desc&limit=5&includes[]=cover_art"
    );
    const data = await response.json();

    return (
        <div>
            <Card>
                <CardContent className="p-5">
                    <h3 className="font-semibold text-lg pb-3">
                        Popular Manga
                    </h3>
                    <div className="grid grid-cols-5 w-full gap-3">
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

                            console.log(element.attributes);

                            return (
                                <div
                                    className="flex flex-col gap-1"
                                    key={index}
                                >
                                    <Image
                                        className="object-cover h-[350px] w-[256px] rounded-md"
                                        src={coverUrl}
                                        alt={`${mangaTitle} cover`}
                                        width={256}
                                        height={400}
                                    />
                                    <p className="text-[14px] font-medium">
                                        {mangaTitle}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
