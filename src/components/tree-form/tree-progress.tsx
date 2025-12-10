"use client";

import React from 'react';
import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TreeProgressProps {
    plantedCount?: number;
    totalCount?: number;
}

export function TreeProgress({ plantedCount = 11, totalCount = 108 }: TreeProgressProps) {
    const remainingCount = totalCount - plantedCount;
    const progressPercentage = (plantedCount / totalCount) * 100;

    return (
        <div className="w-full bg-[#f0fdf4] border border-green-100 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex flex-col space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-green-700">
                        <Target className="w-6 h-6" />
                        <span className="font-bold text-lg tracking-wide uppercase">HELP US REACH OUR TARGET!</span>
                    </div>

                    <div className="text-3xl font-bold text-green-800 tracking-tight">
                        {plantedCount} / {totalCount}
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
                    Help us reach our target! Only <span className="font-bold">{remainingCount}</span> trees remain of <span className="font-bold">{totalCount}</span> saplings in this Seva Drive.
                </p>
            </div>
        </div>
    );
}
