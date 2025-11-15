"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Video,
  Clock,
  Award,
  Play,
  CheckCircle,
  Users,
} from "lucide-react";

// Sample courses data
const courses = [
  {
    id: "course-001",
    title: "Fin(Ai)d Hub Fundamentals",
    description:
      "Learn the basics of Fin(Ai)d Hub and how to use it effectively",
    category: "Getting Started",
    duration: "2 hours",
    level: "Beginner",
    enrolled: 18,
    completed: 12,
    modules: [
      {
        title: "Introduction to Fin(Ai)d Hub",
        duration: "15 min",
        completed: true,
      },
      { title: "Setting Up Your Account", duration: "20 min", completed: true },
      {
        title: "Navigating the Dashboard",
        duration: "25 min",
        completed: true,
      },
      { title: "Working with Fin(Ai)ds", duration: "30 min", completed: false },
      { title: "Basic Reporting", duration: "30 min", completed: false },
    ],
    progress: 60,
  },
  {
    id: "course-002",
    title: "Advanced Fin(Ai)d Configuration",
    description: "Master the advanced features and configurations of Fin(Ai)ds",
    category: "Advanced",
    duration: "3.5 hours",
    level: "Intermediate",
    enrolled: 12,
    completed: 8,
    modules: [
      { title: "Custom Fin(Ai)d Rules", duration: "30 min", completed: false },
      {
        title: "Advanced Data Processing",
        duration: "45 min",
        completed: false,
      },
      {
        title: "Integration with External Systems",
        duration: "45 min",
        completed: false,
      },
      {
        title: "Performance Optimization",
        duration: "30 min",
        completed: false,
      },
      {
        title: "Troubleshooting Common Issues",
        duration: "30 min",
        completed: false,
      },
    ],
    progress: 0,
  },
  {
    id: "course-003",
    title: "Client Management Best Practices",
    description: "Learn how to effectively manage clients in Fin(Ai)d Hub",
    category: "Client Management",
    duration: "2.5 hours",
    level: "Beginner",
    enrolled: 15,
    completed: 10,
    modules: [
      {
        title: "Client Onboarding Process",
        duration: "30 min",
        completed: false,
      },
      {
        title: "Setting Client Expectations",
        duration: "25 min",
        completed: false,
      },
      { title: "Managing Client Data", duration: "35 min", completed: false },
      {
        title: "Client Communication Strategies",
        duration: "30 min",
        completed: false,
      },
      { title: "Client Reporting", duration: "30 min", completed: false },
    ],
    progress: 0,
  },
  {
    id: "course-004",
    title: "Fin(Ai)d Hub Administration",
    description:
      "Learn how to administer and manage your Fin(Ai)d Hub instance",
    category: "Administration",
    duration: "4 hours",
    level: "Advanced",
    enrolled: 8,
    completed: 5,
    modules: [
      { title: "User Management", duration: "30 min", completed: false },
      {
        title: "Role-Based Access Control",
        duration: "45 min",
        completed: false,
      },
      { title: "System Configuration", duration: "45 min", completed: false },
      { title: "Backup and Recovery", duration: "30 min", completed: false },
      { title: "Performance Monitoring", duration: "30 min", completed: false },
      {
        title: "Security Best Practices",
        duration: "30 min",
        completed: false,
      },
    ],
    progress: 0,
  },
  {
    id: "course-005",
    title: "Fin(Ai)d Hub Certification Prep",
    description: "Prepare for the Fin(Ai)d Hub Certified Administrator exam",
    category: "Certification",
    duration: "6 hours",
    level: "Advanced",
    enrolled: 6,
    completed: 3,
    modules: [
      { title: "Certification Overview", duration: "30 min", completed: false },
      { title: "Core Concepts Review", duration: "60 min", completed: false },
      { title: "Administration Review", duration: "60 min", completed: false },
      { title: "Integration Review", duration: "60 min", completed: false },
      { title: "Security Review", duration: "60 min", completed: false },
      { title: "Practice Exam", duration: "90 min", completed: false },
    ],
    progress: 0,
  },
];

export function TrainingCourses() {
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof courses)[0] | null
  >(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterLevel, setFilterLevel] = useState("all");

  const handleViewCourse = (course: (typeof courses)[0]) => {
    setSelectedCourse(course);
    setIsDetailsOpen(true);
  };

  // Filter courses based on selected level
  const filteredCourses =
    filterLevel === "all"
      ? courses
      : courses.filter(
          (course) => course.level.toLowerCase() === filterLevel.toLowerCase()
        );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button
            variant={filterLevel === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterLevel("all")}
          >
            All Levels
          </Button>
          <Button
            variant={filterLevel === "beginner" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterLevel("beginner")}
          >
            Beginner
          </Button>
          <Button
            variant={filterLevel === "intermediate" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterLevel("intermediate")}
          >
            Intermediate
          </Button>
          <Button
            variant={filterLevel === "advanced" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterLevel("advanced")}
          >
            Advanced
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {course.description}
                    </p>
                  </div>
                  <Badge variant="outline">{course.level}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.modules.length} modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolled} enrolled</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCourse(course)}
                  >
                    View Details
                  </Button>
                  {course.progress > 0 ? (
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Continue
                    </Button>
                  ) : (
                    <Button size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Start Course
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
            <DialogDescription>
              View course information and modules
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedCourse.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedCourse.level}</Badge>
                        <Badge variant="outline">
                          {selectedCourse.category}
                        </Badge>
                      </div>
                    </div>
                    {selectedCourse.progress > 0 && (
                      <Badge
                        variant="default"
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        {selectedCourse.progress}% Complete
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground">
                    {selectedCourse.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Duration</div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCourse.duration}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Modules</div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCourse.modules.length} modules</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Enrolled</div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCourse.enrolled} team members</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Completed</div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCourse.completed} team members</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="text-sm font-medium mb-2">
                      What You'll Learn
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Understand the core concepts of Fin(Ai)d Hub
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Configure and deploy Fin(Ai)ds for your clients
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Optimize performance and troubleshoot common issues
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Implement best practices for client management
                        </span>
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="modules" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    {selectedCourse.modules.map((module, index) => (
                      <div key={index} className="rounded-md border p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{module.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {module.duration}
                              </div>
                            </div>
                          </div>
                          {module.completed ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Button size="sm">
                              <Play className="mr-2 h-3 w-3" />
                              Start
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div className="font-medium">Course Handbook</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Comprehensive guide covering all course topics
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Download PDF
                      </Button>
                    </div>

                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <Video className="h-5 w-5 text-primary" />
                        <div className="font-medium">Video Tutorials</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Step-by-step video tutorials for each module
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Access Videos
                      </Button>
                    </div>

                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <div className="font-medium">Practice Exercises</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Hands-on exercises to reinforce your learning
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Start Exercises
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Close
                </Button>
                {selectedCourse.progress > 0 ? (
                  <Button>
                    <Play className="mr-2 h-4 w-4" />
                    Continue Course
                  </Button>
                ) : (
                  <Button>
                    <Play className="mr-2 h-4 w-4" />
                    Start Course
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
