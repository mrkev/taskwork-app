"use client";
import { AsyncResult, RenderAsyncResult } from "@/components/AsyncResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserStatus } from "@/components/useLogin";
import { Task } from "@prisma/client";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTasks } from "./getProblems";

// Mock data for problems
const TEST_TASKS = [
  {
    id: 1,
    title: "API Integration Issue",
    status: "Open",
    dateCreated: "2025-02-28",
    hoursLogged: 4.5,
  },
  {
    id: 2,
    title: "Database Performance",
    status: "In Progress",
    dateCreated: "2025-03-01",
    hoursLogged: 2,
  },
  {
    id: 3,
    title: "UI Responsiveness",
    status: "Resolved",
    dateCreated: "2025-03-02",
    hoursLogged: 6.5,
  },
  {
    id: 4,
    title: "New Problem",
    status: "Open",
    dateCreated: "2025-03-04",
    hoursLogged: 0,
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [login, setLogin] = useState<UserStatus | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("login");
    if (storedUser) {
      setLogin(JSON.parse(storedUser));
    } else {
      router.push("/");
    }
  }, [router]);

  const [tasks, setTasks] = useState<AsyncResult<Task[]>>({
    status: "pending",
  });
  useEffect(() => {
    if (login == null) {
      return;
    }

    try {
      getTasks({ authorId: login.expert.id }).then((tasks) => {
        console.log(tasks);
        setTasks({
          status: "idle",
          value: tasks,
        });
      });
    } catch (error) {
      setTasks({ status: "error", error });
    }
  }, [login?.expert]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center">
          <Link href="/" className="flex items-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Logout
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span className="sr-only">Preview</span>
            </Button>
            <Button variant="outline" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span className="sr-only">Code</span>
            </Button>
            <Button variant="outline" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </header>

        <RenderAsyncResult
          result={tasks}
          pending={null}
          error={null}
          idle={(tasks) => <InfoCardsSection tasks={tasks} />}
        />

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Problems</h2>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                router.push("/task");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add New Problem
            </Button>
          </div>

          <div className="overflow-hidden rounded-lg border bg-white">
            <div className="overflow-x-auto">
              <RenderAsyncResult
                result={tasks}
                pending={null}
                error={null}
                idle={(tasks) => <TaskTable tasks={tasks} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InfoCardsSection({ tasks }: { tasks: Task[] }) {
  const totalProblems = tasks.length;
  const resolvedProblems = TEST_TASKS.filter(
    (p) => p.status === "Resolved"
  ).length;
  const totalHours = TEST_TASKS.reduce((sum, p) => sum + p.hoursLogged, 0);
  const avgHoursPerProblem =
    totalProblems > 0 ? (totalHours / totalProblems).toFixed(1) : "0";

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Problems</p>
            <h3 className="text-3xl font-bold">{totalProblems}</h3>
          </div>
        </CardContent>
      </Card>
      {/* <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-500">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Resolved Problems
            </p>
            <h3 className="text-3xl font-bold">{resolvedProblems}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-500">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Avg. Hours per Problem
            </p>
            <h3 className="text-3xl font-bold">{avgHoursPerProblem}</h3>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

export function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
          {/* <th className="px-6 py-3">ID</th> */}
          <th className="px-6 py-3">PROMPT</th>
          {/* <th className="px-6 py-3">STATUS</th> */}
          <th className="px-6 py-3">DATE CREATED</th>
          <th className="px-6 py-3">GRADE</th>
          <th className="px-6 py-3">ACTIONS</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <tr key={task.id} className="hover:bg-gray-50">
            {/* <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
            #{task.id}
          </td> */}
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
              {task.prompt}
            </td>
            {/* <td className="whitespace-nowrap px-6 py-4 text-sm">
            <span
              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                task.status === "Open"
                  ? "bg-yellow-100 text-yellow-800"
                  : task.status === "In Progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {task.status}
            </span>
          </td> */}
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {task.createdAt.toLocaleDateString()}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  task.veredict === "unsatisfactory"
                    ? "bg-yellow-100 text-yellow-800"
                    : task.veredict === "incorrect"
                    ? "bg-blue-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {task.veredict.toLocaleUpperCase()}
              </span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  disabled
                  className="h-8 text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Button>
                {/* <Button
                  variant="ghost"
                  className="h-8 text-green-600 hover:text-green-800"
                >
                  Log Hours
                </Button> */}
                <Button
                  variant="ghost"
                  disabled
                  className="h-8 text-red-600 hover:text-red-800"
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
