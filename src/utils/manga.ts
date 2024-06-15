export function getRuTitle(
    altTitles: { [key: string]: string }[]
): string | undefined {
    const ruTitleObject = altTitles.find((titleObject) => titleObject.ru);
    return ruTitleObject ? ruTitleObject.ru : undefined;
}
