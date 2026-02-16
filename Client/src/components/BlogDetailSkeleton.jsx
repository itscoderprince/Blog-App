"use client"

import { Skeleton } from "./ui/skeleton"
import { Card, CardContent } from "./ui/card"

export function BlogDetailSkeleton() {
    return (
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                {/* Main Content Skeleton */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Featured Image Skeleton */}
                    <div className="w-full">
                        <Skeleton className="aspect-[21/10] w-full rounded-2xl" />
                    </div>

                    {/* Metadata Skeleton */}
                    <div className="flex flex-wrap items-center gap-4 border-y py-6 border-border/40">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="ml-auto flex gap-4">
                            <Skeleton className="h-8 w-16 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-10 w-[95%]" />
                        <Skeleton className="h-10 w-[70%]" />
                    </div>

                    {/* Content Body Skeleton */}
                    <div className="space-y-4 pt-6">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[85%]" />
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3">
                                    <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
                                    <div className="space-y-2 flex-grow">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
