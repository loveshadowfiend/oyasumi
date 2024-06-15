"use client";

import { cn } from "@/lib/utils";
import useLatestMangaStore from "@/stores/latestMangaStore";
import { useEffect, useState } from "react";

export const ClearHistory = (props: { mangaID: string }) => {
    const { latestMangas, deleteManga } = useLatestMangaStore();
    const [isExist, setIsExist] = useState<boolean>(false);

    useEffect(() => {
        const manga = latestMangas.filter(
            (element) => element.mangaID === props.mangaID
        );

        if (manga.length > 0) {
            setIsExist(true);
        } else {
            setIsExist(false);
        }
    }, [latestMangas, props.mangaID]);

    return (
        <div
            className={cn("flex w-full items-center justify-center", {
                block: isExist,
            })}
        >
            <p
                className="text-sm cursor-pointer active:underline hover:underline"
                onClick={() => deleteManga(props.mangaID)}
            >
                Очистить историю чтения
            </p>
        </div>
    );
};
