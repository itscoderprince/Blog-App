"use client"

import loadingSvg from "@/assets/images/loading.svg"
import { cn } from "@/lib/utils"

const Spinner = ({ className }) => {
    return (
        <img
            src={loadingSvg}
            alt="loading..."
            className={cn("animate-spin-slow h-4 w-4 object-contain", className)}
        />
    )
}

export default Spinner
