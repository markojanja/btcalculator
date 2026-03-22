// components/ThemeSwitcher.jsx
import { Moon, Sun, Palette, Check } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import COLOR_SCHEMES from "../utils/constants.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { mode, colorScheme, toggleMode, setColorScheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="nostyle" size="icon" aria-label="Toggle theme">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="border-none w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Mode
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={toggleMode}
          className="flex items-center gap-2 cursor-pointer"
        >
          {mode === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          Switch to {mode === "dark" ? "Light" : "Dark"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Color Scheme
        </DropdownMenuLabel>
        {COLOR_SCHEMES.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setColorScheme(value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span
              className="h-3 w-3 rounded-full border"
              style={{ background: `var(--scheme-${value})` }}
            />
            {label}
            {colorScheme === value && <Check className="ml-auto h-3 w-3" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
