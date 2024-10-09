"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeModeToggler() {
    const { theme, setTheme } = useTheme()

    const cycleTheme = () => {
        const themes = ["light", "dark"] as const;
        const currentIndex = themes.indexOf(theme as typeof themes[number]);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex] as string);
    }

    return (
        <span className="cursor-pointer w-full flex items-center justify-center" onClick={cycleTheme}>
            {theme === 'light' ? <Sun className="stroke-yellow-500" size={18} /> : <Moon className="stroke-card-foreground" size={18} />}
        </span>
    )
}