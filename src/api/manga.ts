export const fetchMangaByTitle = async (title: string) => {
    try {
        const response = await fetch(
            `https://api.mangadex.org/manga?title=${title}&includes[]=cover_art&order[relevance]=desc`
        );

        const data = await response.json();

        return data;
    } catch (err) {
        return err;
    }
};

export const fetchMangaByID = async (id: string) => {
    try {
        const response = await fetch(
            `https://api.mangadex.org/manga/${id}?includes[]=cover_art`
        );

        const data = await response.json();

        return data;
    } catch (err) {
        return err;
    }
};

export const fetchPopularNewTitles = async () => {
    try {
        const response = await fetch(
            `https://api.mangadex.org/manga?order[followedCount]=desc&limit=10&includes[]=cover_art&contentRating[]=safe`
        );

        const data = await response.json();

        return data;
    } catch (err) {
        return err;
    }
};

export const fetchRecentlyUpdated = async () => {
    try {
        const response = await fetch(
            `https://api.mangadex.org/manga?order[createdAt]=desc&limit=6&includes[]=cover_art&contentRating[]=safe`
        );
        const data = await response.json();

        return data;
    } catch (err) {
        return err;
    }
};
