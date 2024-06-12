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
import useSettingsStore from "@/stores/settingsStore";
import { Theme, useTheme } from "../providers/theme-provider";
import { LANGUAGES } from "@/constants/languages";

const FormSchema = z.object({
    theme: z.string(),
    translatedLanguage: z.string(),
});

export function SettingsForm() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    const { theme, updateTheme, updateTranslatedLanguage } = useSettingsStore();
    const { setTheme } = useTheme();

    return (
        <Form {...form}>
            <form className="w-2/3 space-y-6">
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
                <FormField
                    control={form.control}
                    name="translatedLanguage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Translated Language for Manga</FormLabel>
                            <Select
                                onValueChange={(selectedLanguage) => {
                                    localStorage.setItem(
                                        "translated-language",
                                        selectedLanguage
                                    );

                                    updateTranslatedLanguage([
                                        selectedLanguage,
                                    ]);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={LANGUAGES.get(
                                                localStorage.getItem(
                                                    "translated-language"
                                                ) ?? "en"
                                            )}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ru">Russian</SelectItem>
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
