"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useSettingsStore from "@/stores/settingsStore";
import { Theme, useTheme } from "../providers/theme-provider";
import useChapterSettingsStore from "@/stores/chapterSettingsStore";

const FormSchema = z.object({
    isProgressActive: z.boolean(),
    theme: z.string(),
});

export function ChapterSettingsForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const { theme, updateTheme } = useSettingsStore();
    const { isProgressActive, toggleIsProgressActive } =
        useChapterSettingsStore();
    const { setTheme } = useTheme();

    return (
        <Form {...form}>
            <form className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="isProgressActive"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Show progress bar</FormLabel>
                            <FormControl>
                                <Checkbox
                                    className="ml-3"
                                    defaultChecked={isProgressActive}
                                    onClick={() => {
                                        toggleIsProgressActive();
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                            <FormDescription></FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select
                                onValueChange={(selectedTheme: Theme) => {
                                    localStorage.setItem(
                                        "ui-theme",
                                        selectedTheme
                                    );

                                    updateTheme(selectedTheme);
                                    setTheme(selectedTheme);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                // capitalize
                                                theme.charAt(0).toUpperCase() +
                                                theme.slice(1)
                                            }
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="system">
                                        System
                                    </SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription></FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
