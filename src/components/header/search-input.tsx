"use client";

import useSearchStore from "@/stores/searchStore";
import { Input } from "../ui/input";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface SearchProps extends ComponentProps<"div"> {
    isDialog: boolean;
}

export const SearchInput = (props: SearchProps) => {
    const router = useRouter();
    const { fetchSubmit, updateFetchSubmit, toggleDialog } = useSearchStore();

    useEffect(() => {
        if (!fetchSubmit) return;

        router.push(`/search/${fetchSubmit}`);

        updateFetchSubmit("");
    }, [fetchSubmit, router, toggleDialog, updateFetchSubmit]);

    return (
        <form
            className={cn("flex w-[300px] gap-3", props.className)}
            onSubmit={(e) => {
                e.preventDefault();

                const form = e.target as HTMLFormElement;
                const input = form.elements[0] as HTMLInputElement;

                if (props.isDialog) {
                    toggleDialog();
                }

                updateFetchSubmit(input.value);
                input.value = "";
            }}
        >
            <Input className="w-full" placeholder="Поиск" />
            <Button className="md:hidden">Найти</Button>
        </form>
    );
};
