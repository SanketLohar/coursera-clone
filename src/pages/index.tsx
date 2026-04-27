import React from "react";
import {
  Code,
  Database,
  BrainCircuit,
  School,
  Trophy,
  Target,
  Server,
  Laptop,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { courses } from "@/Components/data/constant";
import SearchBar from "@/Components/SearchBar";
import TagFilter, { Tag } from "@/Components/TagFilter";

const index = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

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

  const filteredCourses = React.useMemo(() => {
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

  const certificates = [
    {
      title: "IBM Back-End Development",
      provider: "IBM",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "IBM Full Stack Software Developer",
      provider: "IBM",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "IBM Developer",
      provider: "IBM",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "IBM DevOps and Software Engineering",
      provider: "IBM",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const newCourses = [
    {
      id: "microsoft-front-end",
      title: "Microsoft Front-End Developer",
      provider: "Microsoft",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "microsoft-backend",
      title: "Microsoft Back-End Developer",
      provider: "Microsoft",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "microsoft-fullstack",
      title: "Microsoft Full-Stack Developer",
      provider: "Microsoft",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "microsoft-project-management",
      title: "Microsoft Project Management",
      provider: "Microsoft",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const genAICourses = [
    {
      title: "IBM Generative AI Engineering",
      provider: "IBM",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Agents: AI and AI Agents for Leaders",
      provider: "DeepLearning.AI",
      type: "Specialization",
      image:
        "https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Microsoft AI & ML Engineering",
      provider: "Microsoft",
      type: "Professional Certificate",
      image:
        "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80",
    },
  ];
  const categories = [
    { icon: Code, name: "Computer Science", count: "425+ Courses" },
    { icon: Database, name: "Data Science", count: "320+ Courses" },
    { icon: BrainCircuit, name: "AI & ML", count: "280+ Courses" },
    { icon: School, name: "Business", count: "890+ Courses" },
    { icon: Trophy, name: "Personal Development", count: "215+ Courses" },
    { icon: Target, name: "Marketing", count: "190+ Courses" },
  ];

  const stats = [
    { number: "92M+", label: "Learners" },
    { number: "3,800+", label: "Courses" },
    { number: "275+", label: "Partners" },
    { number: "175+", label: "Countries" },
  ];
  return (
    <div>
      <div className="bg-[#F3F4F5] py-2 relative">
        <div className="max-w-7xl mx-auto px-4 pr-10">
          <p className="text-sm text-center leading-relaxed">
            Learn from Adobe experts, gain graphic design skills, and build a
            portfolio that gets you noticed.
            <Link href="/search" className="text-[#0056D2] ml-1 hover:underline whitespace-nowrap">
              Learn today!
            </Link>
          </p>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-2">✕</button>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-between items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Learn without limits
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Start, switch, or advance your career with more than 10,000
                courses, Professional Certificates, and degrees from world-class
                universities and companies.
              </p>
              <div className="flex space-x-4">
                <Link href="/search" className="inline-block px-6 py-3 bg-[#0056D2] text-white font-semibold rounded-sm">
                  Join for Free
                </Link>
                <Link href="/search" className="inline-block px-6 py-3 border border-[#0056D2] text-[#0056D2] font-semibold rounded-sm">
                  Try Coursera for Business
                </Link>
              </div>
            </div>
            <div className="relative w-[500px] h-[350px] hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Student"
                fill
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Most Popular Certificates</h2>
            <div className="flex space-x-4">
              <Link href="/search" className="inline-block px-4 py-2 border text-[#0056D2] font-semibold rounded-sm">
                Show more
              </Link>
              <Link href="/search" className="inline-block px-4 py-2 text-[#0056D2] font-semibold">
                View all
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificates.map((cert, index) => (
              <Link
                key={index}
                href="/search"
                className="block border rounded-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <Server className="h-6 w-6 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {cert.provider}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{cert.title}</h3>
                  <p className="text-sm text-gray-600">{cert.type}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#F3F4F5] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Get started with GenAI
              </h2>
              <p className="text-gray-600">
                Identify, develop, and execute impactful GenAI business
                strategies.
              </p>
            </div>
            <Link href="/search" className="ml-auto inline-block px-4 py-2 text-[#0056D2] font-semibold">
              View all GenAI
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {genAICourses.map((course, index) => (
              <Link
                key={index}
                href="/search"
                className="block bg-white rounded-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <BrainCircuit className="h-6 w-6 mr-2 text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {course.provider}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.type}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Explore Courses</h2>
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
                  className="border rounded-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
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

      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Explore Top Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center p-6 bg-white rounded-lg hover:shadow-md cursor-pointer"
              >
                <category.icon className="h-8 w-8 text-[#0056D2] mr-4" />
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0056D2] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Join the World's Largest Learning Platform
            </h2>
            <p className="text-blue-100">
              Transform your life through education
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
