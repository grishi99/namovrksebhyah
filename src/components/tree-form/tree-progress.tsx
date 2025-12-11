"use client";

import React from 'react';
import { Progress } from '@/components/ui/progress';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

interface TreeProgressProps {
    plantedCount?: number; // Optional: can be used to override live data
    totalCount?: number;
}

export function TreeProgress({ plantedCount: initialCount, totalCount = 108 }: TreeProgressProps) {
    const firestore = useFirestore();

    const confirmedSubmissionsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'submissions'), where('status', '==', 'confirmed'));
    }, [firestore]);

    const { data: confirmedSubmissions } = useCollection(confirmedSubmissionsQuery);

    const livePlantedCount = React.useMemo(() => {
        if (!confirmedSubmissions) return 0;

        return confirmedSubmissions.reduce((total, s: any) => {
            let count = 0;
            if (s.plantingOption) {
                if (s.plantingOption === 'other-planting') {
                    count = s.otherTrees ? parseInt(s.otherTrees, 10) : 0;
                } else {
                    const match = s.plantingOption.match(/(\d+)-tree/);
                    count = match ? parseInt(match[1], 10) : 0;
                }
            }
            // Check for lifetime plans which also include planting (if implied, but user form separates them. 
            // "Bundle Plans" or "Lifetime Plans" might imply planting too, but based on "I Wish to Plant" section logic, we strictly check plantingOption.
            // If the user wants bundles to count as trees, we should add logic here. 
            // For now, "I Wish to Plant" is the explicit planting section.)
            // Logic update: The progress bar is "Trees Planted". "Adoption" is separate in the form. 
            // However, "Family Pack: 3 trees" could imply 3 trees planted? 
            // Let's stick to explicitly planted trees count from 'plantingOption' to be safe, unless told otherwise.
            // Actually, "Trees Planted" usually implies physical planting. 
            // Let's check if 'bundlePlanOption' or 'lifetimePlanOption' implies new trees. 
            // "Family Pack: 3 trees for 3 years" -> implies adoption of existing? or planting 3 new?
            // The prompt says "Only if admin confirms... tree plant counter shows 1, 2...". 
            // It links to "I Wish to Plant" section.

            return total + (isNaN(count) ? 0 : count);
        }, 0);
    }, [confirmedSubmissions]);

    const currentCount = initialCount !== undefined ? initialCount : livePlantedCount;
    const remainingCount = Math.max(0, totalCount - currentCount);
    const progressPercentage = Math.min(100, (currentCount / totalCount) * 100);

    return (
        <div className="w-full bg-[#f0fdf4] border border-green-100 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex flex-col space-y-4 text-center">
                {/* Header: Title and Count */}
                <div className="space-y-2">
                    <h3 className="font-bold text-lg text-green-700 tracking-wide uppercase">
                        HELP US REACH OUR TARGET!
                    </h3>
                    <div className="text-4xl font-extrabold text-green-800 tracking-tight">
                        {currentCount} / {totalCount}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-4 w-full bg-green-200/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Footer Text */}
                <p className="text-green-800 font-medium text-lg leading-relaxed">
                    Only <span className="font-bold">{remainingCount}</span> trees remaining.
                </p>
            </div>
        </div>
    );
}
