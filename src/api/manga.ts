import { getSixMonthAgo } from "@/utils/dates";

export const fetchMangaByTitle = async (title: string) => {
    const response = await fetch(
        `/api/manga?title=${title}&includes[]=cover_art&order[relevance]=desc`
    );

    const data = await response.json();

    return data;
};

export const fetchMangaByID = async (id: string) => {
    const response = await fetch(`/api/manga/${id}?includes[]=cover_art`);

    const data = await response.json();

    return data;
};

export const fetchPopularNewTitles = async () => {
    const response = await fetch(
        `/api/manga?order[followedCount]=desc&limit=10&includes[]=cover_art&contentRating[]=safe`
    );

    const data = await response.json();

    return data;
};

export const fetchRecentlyUpdated = async () => {
    const response = await fetch(
        `/api/manga?order[createdAt]=desc&limit=6&includes[]=cover_art&contentRating[]=safe`
    );
    const data = await response.json();

    return data;
};
