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
import useChapterSettingsStore from "@/stores/chapterSettingsStore";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { THEMES } from "@/constants/themes";

const FormSchema = z.object({
    isProgressActive: z.boolean(),
    theme: z.string(),
});

export function ChapterSettingsForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const theme = localStorage.getItem("theme") ?? "system";
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
                        <FormItem className="flex items-center h-full">
                            <FormLabel>Показывать прогресс чтения</FormLabel>
                            <FormControl>
                                <Switch
                                    className="ml-3 !mt-0"
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
                            <FormLabel>Тема</FormLabel>
                            <Select
                                onValueChange={(selectedTheme: string) => {
                                    setTheme(selectedTheme);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={THEMES.get(theme)}
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
