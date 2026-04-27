import React, { useEffect, useMemo, useState } from "react";
import { Laptop } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { courses } from "@/Components/data/constant";
import SearchBar from "@/Components/SearchBar";
import TagFilter, { Tag } from "@/Components/TagFilter";

const SearchPage = () => {
    const router = useRouter();
    const { q } = router.query;
    const initialQuery = typeof q === "string" ? q : "";

    const [searchTerm, setSearchTerm] = useState(initialQuery);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        if (typeof q === "string") {
            setSearchTerm(q);
        }
    }, [q]);

    const TAGS: Tag[] = [
        { id: "development", label: "Development" },
        { id: "data", label: "Data" },
        { id: "design", label: "Design" },
        { id: "marketing", label: "Marketing" },
        { id: "business", label: "Business" },
    ];

    const handleToggleTag = (tagId: string) => {
        setSelectedTags((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedTags([]);
    };

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                course.title.toLowerCase().includes(searchLower) ||
                course.description.toLowerCase().includes(searchLower);

            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.some((tagId) => {
                    const tagLabel = TAGS.find((t) => t.id === tagId)?.label.toLowerCase() || "";
                    return (
                        course.skills.some((skill) => skill.toLowerCase().includes(tagLabel)) ||
                        course.title.toLowerCase().includes(tagLabel) ||
                        course.description.toLowerCase().includes(tagLabel) ||
                        course.type.toLowerCase().includes(tagLabel)
                    );
                });

            return matchesSearch && matchesTags;
        });
    }, [searchTerm, selectedTags]);

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Search Courses</h1>
                        <p className="text-gray-600">
                            Find the perfect course by searching or filtering by category.
                        </p>
                    </div>
                    {(searchTerm || selectedTags.length > 0) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className="mb-8 space-y-4">
                    <SearchBar value={searchTerm} onChange={setSearchTerm} />
                    <TagFilter
                        tags={TAGS}
                        selectedTags={selectedTags}
                        onToggleTag={handleToggleTag}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course, index) => (
                            <Link
                                key={index}
                                href={`/course/${course.id}`}
                                className="border rounded-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col group"
                            >
                                <div className="relative w-full h-40">
                                    <Image
                                        src={course.image}
                                        alt={course.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex items-center mb-2">
                                        <Laptop className="h-6 w-6 mr-2 text-blue-600 flex-shrink-0" />
                                        <span className="text-sm text-gray-600 truncate">
                                            {course.provider}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold mb-2 line-clamp-2">{course.title}</h3>
                                    <p className="text-sm text-gray-600 mt-auto">{course.type}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            No courses found matching your criteria. Try adjusting your search or filters.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
