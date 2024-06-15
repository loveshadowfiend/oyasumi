import { fetchRecentlyUpdated } from "@/api/manga";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default async function RecentlyUpdated() {
    // const { data, isLoading } = useQuery({
    //     queryKey: ["recentlyUpdated"],
    //     queryFn: () => fetchRecentlyUpdated(),
    // });

    const data = await fetchRecentlyUpdated();

    // if (isLoading) {
    //     return (
    //         <div>
    //             <h3 className="font-semibold text-lg pb-3">
    //                 Обновлено недавно
    //             </h3>
    //             <ScrollArea className="w-full whitespace-nowrap">
    //                 <div
    //                     className="flex w-max space-x-4 pb-3
    //                             xl:grid xl:grid-cols-6 xl:gap-3 xl:w-full"
    //                 >
    //                     <div className="flex flex-col gap-2">
    //                         <Skeleton className="w-auto h-[300px]" />
    //                         <Skeleton className="w-full h-[20px]" />
    //                     </div>
    //                     <div className="flex flex-col gap-2">
    //                         <Skeleton className="w-auto h-[300px]" />
    //                         <Skeleton className="w-full h-[20px]" />
    //                     </div>
    //                     <div className="flex flex-col gap-2">
    //                         <Skeleton className="w-auto h-[300px]" />
    //                         <Skeleton className="w-full h-[20px]" />
    //                     </div>
    //                     <div className="flex flex-col gap-2">
    //                         <Skeleton className="w-auto h-[300px]" />
    //                         <Skeleton className="w-full h-[20px]" />
    //                     </div>
    //                     <div className="flex flex-col gap-2">
    //                         <Skeleton className="w-auto h-[300px]" />
    //                         <Skeleton className="w-full h-[20px]" />
    //                     </div>
    //                     <div className="flex flex-col gap-2">
    //                         <Skeleton className="w-auto h-[300px]" />
    //                         <Skeleton className="w-full h-[20px]" />
    //                     </div>
    //                 </div>
    //                 <ScrollBar orientation="horizontal" />
    //             </ScrollArea>
    //         </div>
    //     );
    // }

    return (
        <div>
            <h3 className="font-semibold text-lg pb-3">Обновлено недавно</h3>
            <ScrollArea className="w-full whitespace-nowrap">
                <div
                    className="flex w-max space-x-4 pb-3
                                xl:grid xl:grid-cols-6 xl:w-full"
                >
                    {data.data.map((manga, index) => {
                        const mangaId = manga.id;
                        const mangaTitle =
                            manga.attributes.title.ru ??
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
                            <Link
                                className="w-[200px] xl:w-auto"
                                key={index}
                                href={`manga/${mangaId}`}
                            >
                                <div className="flex flex-col gap-1 break-normal">
                                    <Image
                                        className="object-cover w-auto h-[300px] rounded-md"
                                        src={coverUrl}
                                        alt={`${mangaTitle} cover`}
                                        width={200}
                                        height={300}
                                    />
                                    <p className="text-[14px] font-medium truncate">
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
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
