"use client";

import useSearchStore from "@/stores/searchStore";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export const SearchInput = () => {
    const router = useRouter();
    const { fetchSubmit, updateFetchSubmit } = useSearchStore();

    useEffect(() => {
        if (!fetchSubmit) return;

        router.push(`/search/${fetchSubmit}`);

        updateFetchSubmit("");
    }, [fetchSubmit, router, updateFetchSubmit]);

    return (
        <form
            className="hidden md:block"
            onSubmit={(e) => {
                e.preventDefault();

                const form = e.target as HTMLFormElement;
                const input = form.elements[0] as HTMLInputElement;

                updateFetchSubmit(input.value);
                input.value = "";
            }}
        >
            <Input className="w-[300px]" placeholder="search" />
        </form>
    );
};
