"use client";

import useSearchStore from "@/stores/searchStore";
import { Input } from "../ui/input";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface SearchProps extends ComponentProps<"div"> {
    isDialog: boolean;
}

export const SearchInput = (props: SearchProps) => {
    const router = useRouter();
    const { fetchSubmit, updateFetchSubmit, toggleDialog, isDialogOpen } =
        useSearchStore();

    useEffect(() => {
        if (!fetchSubmit) return;

        router.push(`/search/${fetchSubmit}`);

        updateFetchSubmit("");
    }, [fetchSubmit, router, toggleDialog, updateFetchSubmit]);

    console.log(isDialogOpen);

    return (
        <form
            className={cn("w-[300px]", props.className)}
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
            <Input className="w-full" placeholder="search" />
        </form>
    );
};
