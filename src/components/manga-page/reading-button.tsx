"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useLatestMangaStore from "@/stores/latestMangaStore";
import { useRouter } from "next/navigation";
import useSettingsStore from "@/stores/settingsStore";
import { fetchFeed } from "@/api/feed";
import { useQuery } from "@tanstack/react-query";
import { toast } from "../ui/use-toast";

export const ReadingButton = (props: { mangaID: string }) => {
    const [continueReading, setContinueReading] = useState<any>(null);

    const [isNew, setIsNew] = useState(false);

    const router = useRouter();
    const { latestMangas } = useLatestMangaStore();
    const { translatedLanguage } = useSettingsStore();

    const { data: feedData, isLoading } = useQuery({
        enabled: !!isNew,
        queryKey: ["feed", props.mangaID, translatedLanguage],
        queryFn: () =>
            fetchFeed(props.mangaID, "asc", 0, translatedLanguage, 1),
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        const manga = latestMangas.filter(
            (element) => element.mangaID === props.mangaID
        );

        if (manga.length > 0) {
            setContinueReading(manga[0]);
        } else {
            setContinueReading(null);
        }
    }, [latestMangas, props.mangaID]);

    useEffect(() => {
        if (!isNew || !feedData) return;

        if (!feedData.data.length) {
            toast({
                description:
                    "Глав не найден :( Попробуйте сменить язык перевода в настройках",
            });

            return;
        }

        router.push(`/chapter/${feedData.data[0].id}/1`);
    }, [isNew, feedData, router]);

    if (isLoading || isNew) {
        return (
            <Button
                className="w-full"
                onClick={(e) => {
                    e.preventDefault();
                }}
            >
                {isLoading ? "Загружаем..." : "Перенаправляем..."}
            </Button>
        );
    }
    return (
        <Button
            className="w-full"
            onClick={(e) => {
                e.preventDefault();

                if (continueReading) {
                    router.push(continueReading.pathname);

                    return;
                }

                setIsNew(true);
            }}
        >
            {continueReading === null ? "Начать читать" : "Продолжить читать"}
        </Button>
    );
};
