"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

// https://api.mangadex.org/at-home/server/835eefc1-c9e3-42f1-b642-7e072c88ca61
const fetchAtHome = async (chapterID: string) => {
    const response = await fetch(
        `https://api.mangadex.org/at-home/server/${chapterID}`
    );
    const data = await response.json();

    return data;
};

export default function ChapterPage({ params }: { params: { id: string } }) {
    const [page, setPage] = useState<number>(0);
    const [isProgressHidden, setIsProgressHidden] = useState<boolean>(false);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

    const { data: atHomeData } = useQuery({
        enabled: !!params.id,
        queryKey: ["atHome", params.id],
        queryFn: () => fetchAtHome(params.id),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isTimerActive) return;
        setIsProgressHidden(false);

        setIsTimerActive(true);
        setTimeout(() => {
            setIsProgressHidden(true);
            setIsTimerActive(false);
        }, 2000);
    }, [page]);

    return (
        <div className="w-screen h-screen">
            {/* back area */}
            <div
                className="absolute h-full w-[50%] cursor-pointer z-1 left-0"
                onClick={() => setPage(page - 1)}
            />
            {/* next area */}
            <div
                className="absolute h-full w-[50%] cursor-pointer z-1 left-[50%]"
                onClick={() => setPage(page + 1)}
            />
            <div className="flex items-center justify-center absolute z-2 bottom-[5px] left-[50%] translate-x-[-50%]">
                {atHomeData !== undefined && (
                    <Progress
                        value={
                            ((page + 1) * 100) / atHomeData.chapter.data.length
                        }
                        className={cn(
                            "w-[95vw] h-[5px] transition-opacity ease-in-out delay-50 duration-300",
                            {
                                "opacity-0": isProgressHidden,
                                "opacity-100": !isProgressHidden,
                            }
                        )}
                        onChange={() => {}}
                    />
                )}
            </div>

            {atHomeData !== undefined && (
                <div className="flex items-center justify-center">
                    {atHomeData.chapter.data.map((element, index) => {
                        const host = atHomeData.baseUrl;
                        const hash = atHomeData.chapter.hash;

                        return (
                            <Image
                                className={cn("h-screen w-auto", {
                                    hidden: index !== page,
                                })}
                                src={`${host}/data/${hash}/${element}`}
                                key={index}
                                alt={`page ${page + 1}`}
                                width={0}
                                height={0}
                                sizes="100vh"
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
