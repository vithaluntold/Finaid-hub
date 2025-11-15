"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  Award,
  BookOpen,
  BarChart,
  Calendar,
} from "lucide-react";

// Sample training data
const trainingData = {
  totalCourses: 12,
  completedCourses: 8,
  inProgressCourses: 3,
  upcomingCourses: 1,
  totalEmployees: 24,
  certifiedEmployees: 18,
  topPerformers: [
    {
      id: "emp-001",
      name: "Jane Smith",
      role: "Senior Accountant",
      progress: 92,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "emp-002",
      name: "Michael Johnson",
      role: "Accountant",
      progress: 88,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "emp-003",
      name: "Emily Davis",
      role: "Bookkeeper",
      progress: 85,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  recentCertifications: [
    {
      id: "cert-001",
      accountant: "Jane Smith",
      course: "Advanced Fin(Ai)d Management",
      date: "2023-11-10",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "cert-002",
      accountant: "Robert Wilson",
      course: "Fin(Ai)d Integration Specialist",
      date: "2023-11-05",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "cert-003",
      accountant: "Sarah Thompson",
      course: "AI-Assisted Bookkeeping",
      date: "2023-10-28",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
};

export function TrainingProgress() {
  const [timeRange, setTimeRange] = useState("month");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainingData.totalCourses}
            </div>
            <p className="text-xs text-muted-foreground">
              +2 from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (trainingData.completedCourses / trainingData.totalCourses) *
                  100
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certified Accountants
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainingData.certifiedEmployees}/{trainingData.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground">
              75% certification rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Courses
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainingData.upcomingCourses}
            </div>
            <p className="text-xs text-muted-foreground">
              Next course starts in 2 weeks
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accountants">Accountants</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
              <CardDescription>
                Overall training progress across all courses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Completed</span>
                  </div>
                  <span className="font-medium">
                    {trainingData.completedCourses} courses
                  </span>
                </div>
                <Progress
                  value={
                    (trainingData.completedCourses /
                      trainingData.totalCourses) *
                    100
                  }
                  className="h-2 bg-muted"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>In Progress</span>
                  </div>
                  <span className="font-medium">
                    {trainingData.inProgressCourses} courses
                  </span>
                </div>
                <Progress
                  value={
                    (trainingData.inProgressCourses /
                      trainingData.totalCourses) *
                    100
                  }
                  className="h-2 bg-muted"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Upcoming</span>
                  </div>
                  <span className="font-medium">
                    {trainingData.upcomingCourses} courses
                  </span>
                </div>
                <Progress
                  value={
                    (trainingData.upcomingCourses / trainingData.totalCourses) *
                    100
                  }
                  className="h-2 bg-muted"
                />
              </div>

              <div className="rounded-md bg-muted p-4">
                <h4 className="font-medium mb-2">Top Performing Accountants</h4>
                <div className="space-y-4">
                  {trainingData.topPerformers.map((accountant) => (
                    <div
                      key={accountant.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={accountant.avatar}
                            alt={accountant.name}
                          />
                          <AvatarFallback>
                            {accountant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{accountant.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {accountant.role}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={accountant.progress}
                          className="h-2 w-24 bg-muted"
                        />
                        <span className="text-sm font-medium">
                          {accountant.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Certifications</CardTitle>
                <CardDescription>
                  Accountants who recently completed certifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingData.recentCertifications.map((cert) => (
                    <div key={cert.id} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={cert.avatar} alt={cert.accountant} />
                        <AvatarFallback>
                          {cert.accountant.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{cert.accountant}</div>
                        <div className="text-sm text-muted-foreground">
                          {cert.course}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(cert.date)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Effectiveness</CardTitle>
                <CardDescription>
                  Impact of training on performance
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[220px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="mx-auto h-16 w-16 opacity-50" />
                  <p className="mt-2">
                    Training effectiveness chart will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accountants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accountant Training Status</CardTitle>
              <CardDescription>Training progress by accountant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                  <div className="col-span-5">Accountant</div>
                  <div className="col-span-3">Progress</div>
                  <div className="col-span-2">Completed</div>
                  <div className="col-span-2">Status</div>
                </div>

                <div className="divide-y">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 p-4 items-center"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                          />
                          <AvatarFallback>
                            {index === 0
                              ? "JS"
                              : index === 1
                              ? "MJ"
                              : index === 2
                              ? "ED"
                              : index === 3
                              ? "RW"
                              : "ST"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {index === 0
                              ? "Jane Smith"
                              : index === 1
                              ? "Michael Johnson"
                              : index === 2
                              ? "Emily Davis"
                              : index === 3
                              ? "Robert Wilson"
                              : "Sarah Thompson"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {index === 0
                              ? "Senior Accountant"
                              : index === 1
                              ? "Accountant"
                              : index === 2
                              ? "Bookkeeper"
                              : index === 3
                              ? "Financial Analyst"
                              : "Tax Specialist"}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3 flex items-center gap-2">
                        <Progress
                          value={
                            index === 0
                              ? 92
                              : index === 1
                              ? 88
                              : index === 2
                              ? 85
                              : index === 3
                              ? 70
                              : 60
                          }
                          className="h-2 flex-1 bg-muted"
                        />
                        <span className="text-sm font-medium">
                          {index === 0
                            ? "92%"
                            : index === 1
                            ? "88%"
                            : index === 2
                            ? "85%"
                            : index === 3
                            ? "70%"
                            : "60%"}
                        </span>
                      </div>

                      <div className="col-span-2 text-sm">
                        {index === 0
                          ? "6/6"
                          : index === 1
                          ? "5/6"
                          : index === 2
                          ? "5/6"
                          : index === 3
                          ? "4/6"
                          : "3/6"}{" "}
                        courses
                      </div>

                      <div className="col-span-2">
                        <Badge
                          variant={
                            index === 0
                              ? "default"
                              : index === 3 || index === 4
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {index === 0
                            ? "Certified"
                            : index === 3 || index === 4
                            ? "In Progress"
                            : "Advanced"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Certification Programs</CardTitle>
              <CardDescription>
                Available certification programs for accountants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Fin(Ai)d Integration Specialist
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learn how to integrate and configure Fin(Ai)ds for
                        optimal performance
                      </p>
                    </div>
                    <Badge>Advanced</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> 4 weeks
                    </div>
                    <div>
                      <span className="font-medium">Modules:</span> 6
                    </div>
                    <div>
                      <span className="font-medium">Certified:</span> 8
                      accountant
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">AI-Assisted Bookkeeping</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Master the art of AI-assisted bookkeeping and
                        transaction management
                      </p>
                    </div>
                    <Badge variant="secondary">Intermediate</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> 3 weeks
                    </div>
                    <div>
                      <span className="font-medium">Modules:</span> 5
                    </div>
                    <div>
                      <span className="font-medium">Certified:</span> 12
                      Accountants
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">
                        Advanced Fin(Ai)d Management
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Advanced techniques for managing and optimizing
                        Fin(Ai)ds
                      </p>
                    </div>
                    <Badge>Advanced</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <span className="font-medium">Duration:</span> 6 weeks
                    </div>
                    <div>
                      <span className="font-medium">Modules:</span> 8
                    </div>
                    <div>
                      <span className="font-medium">Certified:</span> 5
                      Accountants
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
