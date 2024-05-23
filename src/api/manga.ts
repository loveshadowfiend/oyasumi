export const fetchMangaByTitle = async (title: string) => {
    const response = await fetch(
        `http://www.api.mangadex.org/manga?title=${title}&includes[]=cover_art&order[relevance]=desc`,
        {
            mode: "no-cors",
        }
    );

    const data = await response.json();

    return data;
};
