import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getOneMonthAgo = () => {
    var d = new Date();

    d.setMonth(d.getMonth() - 1);
    d.setHours(0, 0, 0, 0);

    return d.toISOString().substring(0, d.toISOString().length - 5);
};

export const getSixMonthAgo = () => {
    var d = new Date();

    d.setMonth(d.getMonth() - 6);
    d.setHours(0, 0, 0, 0);

    return d.toISOString().substring(0, d.toISOString().length - 5);
};

export function getRuTitle(
    altTitles: { [key: string]: string }[]
): string | undefined {
    const ruTitleObject = altTitles.find((titleObject) => titleObject.ru);
    return ruTitleObject ? ruTitleObject.ru : undefined;
}
