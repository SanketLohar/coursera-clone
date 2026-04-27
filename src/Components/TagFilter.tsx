import React from 'react';

export interface Tag {
    id: string;
    label: string;
}

interface TagFilterProps {
    tags: Tag[];
    selectedTags: string[];
    onToggleTag: (tagId: string) => void;
    className?: string;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onToggleTag, className = '' }) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                    <button
                        key={tag.id}
                        aria-pressed={isSelected}
                        onClick={() => onToggleTag(tag.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${isSelected
                                ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }
            `}
                    >
                        {tag.label}
                    </button>
                );
            })}
        </div>
    );
};

export default TagFilter;
