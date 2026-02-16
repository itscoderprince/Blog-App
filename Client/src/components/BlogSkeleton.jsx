"use client"

import { Card, CardContent } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export function BlogSkeleton() {
    return (
        <Card className="overflow-hidden py-0 gap-0 border border-border/40 shadow-sm bg-card rounded-xl flex flex-col h-full">
            {/* Image Section Skeleton */}
            <div className="relative aspect-[16/10]">
                <Skeleton className="h-full w-full rounded-none" />
                {/* Category Badge Skeleton */}
                <Skeleton className="absolute top-1.5 right-1.5 h-4 w-16 rounded-full" />
            </div>

            {/* Content Section Skeleton */}
            <CardContent className="p-2 flex flex-col flex-grow gap-2">
                <div className="space-y-2 flex-grow">
                    {/* Title Skeletons */}
                    <Skeleton className="h-5 w-[90%]" />
                    <Skeleton className="h-5 w-[70%]" />

                    {/* Description Skeletons */}
                    <div className="space-y-1 mt-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-[85%]" />
                    </div>
                </div>

                {/* Author Section Skeleton */}
                <div className="flex items-center gap-3 mt-auto pt-1">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
