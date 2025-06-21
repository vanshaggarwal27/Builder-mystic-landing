import React from "react";
import { Star, Award, Users, BookOpen, Trophy } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Badge } from "@/components/ui/badge";

const successStories = [
  {
    id: 1,
    title: "100% Pass Rate in Board Exams",
    description:
      "SHKVA achieved a remarkable 100% pass rate in Class 10 and 12 board examinations for the academic year 2023-24.",
    year: "2024",
    category: "Academic Excellence",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
    stats: "450+ Students",
  },
  {
    id: 2,
    title: "Digital Transformation Success",
    description:
      "Successfully implemented complete digital learning management system, improving student engagement by 85%.",
    year: "2024",
    category: "Technology",
    icon: BookOpen,
    color: "from-blue-500 to-purple-500",
    stats: "1,200+ Users",
  },
  {
    id: 3,
    title: "National Science Olympiad Winners",
    description:
      "Our students secured top 3 positions in National Science Olympiad, bringing pride to SHKVA community.",
    year: "2023",
    category: "Competition",
    icon: Award,
    color: "from-green-500 to-teal-500",
    stats: "15 Winners",
  },
  {
    id: 4,
    title: "Zero Dropout Initiative",
    description:
      "Achieved zero dropout rate through innovative student support programs and personalized attention.",
    year: "2023",
    category: "Social Impact",
    icon: Users,
    color: "from-pink-500 to-red-500",
    stats: "100% Retention",
  },
  {
    id: 5,
    title: "Excellence in Teacher Training",
    description:
      "89 teachers completed advanced pedagogical training, enhancing teaching quality and student outcomes.",
    year: "2024",
    category: "Professional Development",
    icon: Star,
    color: "from-indigo-500 to-blue-500",
    stats: "89 Teachers",
  },
];

export default function AdminSuccessStories() {
  return (
    <>
      <MobileLayout
        title="Success Stories"
        headerGradient="from-green-600 to-blue-600"
        className="pb-20"
      >
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Our Achievements
              </h2>
              <p className="text-gray-600 text-sm">
                Celebrating milestones and successes at SHKVA
              </p>
            </div>

            {/* Success Stories */}
            <div className="space-y-4">
              {successStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-r ${story.color} flex-shrink-0`}
                    >
                      <story.icon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {story.title}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {story.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {story.year}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-sm font-semibold text-gray-900">
                            {story.stats}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm leading-relaxed">
                        {story.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border-l-4 border-green-400">
              <h3 className="font-semibold text-gray-800 mb-2">
                Impact Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">5</div>
                  <div className="text-gray-600">Major Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">1,200+</div>
                  <div className="text-gray-600">Lives Impacted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
      <BottomNavigation />
    </>
  );
}
