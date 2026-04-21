"use client";
import { useTheme } from "@/context/ThemeContext";
import { BiSun, BiMoon } from "react-icons/bi";
import Button from "@/components/ui/Button";
import styles from "@/components/ui/button.module.css"

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className={styles.transparent}
      aria-label="Theme Switcher"
    >
      {theme === "light" ? <BiMoon size={24} /> : <BiSun size={24} />}
    </Button>
  );
}