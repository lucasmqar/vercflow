import { cn } from "@/lib/utils";
import { useState } from "react";

export const AiLoader = () => {
    const [count, setCount] = useState(0);

    return (
        <div className="h-screen w-full flex items-center justify-center bg-background">

            <div className="loader-wrapper">
                <span className="loader-letter">V</span>
                <span className="loader-letter">E</span>
                <span className="loader-letter">R</span>
                <span className="loader-letter">C</span>
                <span className="loader-letter">F</span>
                <span className="loader-letter">L</span>
                <span className="loader-letter">O</span>
                <span className="loader-letter">W</span>

                <div className="loader"></div>
            </div>

        </div>
    );
};
