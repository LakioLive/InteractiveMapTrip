import { useState, useEffect } from "react";
import { FiMoon } from "react-icons/fi";
import { LuSun } from "react-icons/lu";

export default function DarkModeBtn() {
    const [handleDarkMode, setHandleDarkMode] = useState(
        localStorage.getItem("darkMode"),
    );

    useEffect(() => {
        if (handleDarkMode === "true") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    }, [handleDarkMode]);

    return (
        <div
            className="absolute top-20 left-2 p-2 dark:text-white text-xl bg-white dark:bg-second-gray rounded-lg z-[999] cursor-pointer transition-colors duration-700"
            onClick={() =>
                setHandleDarkMode(handleDarkMode === "true" ? "false" : "true")
            }
        >
            {handleDarkMode === "false" ? <FiMoon /> : <LuSun />}
        </div>
    );
}
