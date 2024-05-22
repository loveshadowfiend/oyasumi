export const fetchMangaByTitle = async (title: string) => {
    const response = await fetch(
        `https://api.mangadex.org/manga?title=${title}&includes[]=cover_art&order[relevance]=desc`
    );

    const data = await response.json();

    return data;
};
