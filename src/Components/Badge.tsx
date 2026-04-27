import React from 'react';
import { Flame } from 'lucide-react';

interface BadgeProps {
    days: number;
    unlocked: boolean;
}

const Badge: React.FC<BadgeProps> = ({ days, unlocked }) => {
    return (
        <div className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${unlocked ? 'border-orange-500 bg-orange-50 shadow-md transform hover:-translate-y-1' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
            <div className={`p-3 rounded-full mb-2 ${unlocked ? 'bg-orange-500 shadow-sm' : 'bg-gray-300'}`}>
                <Flame className={`h-8 w-8 ${unlocked ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <h4 className={`font-bold text-center leading-tight ${unlocked ? 'text-orange-700' : 'text-gray-500'}`}>
                {days} Day<br />Streak
            </h4>
        </div>
    );
};

export default Badge;
