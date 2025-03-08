"use client";

import { ModelResponse } from "@/components/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { askAI, submitTask } from "./actions";
import { FORMID } from "./formIds";
import { useLogin } from "@/components/useLogin";
import { nullthrows } from "@/components/utils";

type ResponseGrade = "correct" | "unsatisfactory" | "incorrect";

function formString(formData: FormData, name: keyof typeof FORMID): string {
  return nullthrows(formData.get(FORMID[name]), "missing " + name) as string;
}

function formOptString(
  formData: FormData,
  name: keyof typeof FORMID
): string | undefined {
  return (formData.get(FORMID[name]) ?? undefined) as string | undefined;
}

export default function TaskingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [showPlaintext, setShowPlaintext] = useState(false);
  const [grade, setGrade] = useState<ResponseGrade | null>(null);
  const user = useLogin();

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ModelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGrade(null);
    try {
      const response = await askAI(prompt);
      if (response == null) {
        setError("There was an error, the AI is broken");
        setLoading(false);
        return;
      }

      setResponse(response);
      setLoading(false);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const handleFeedbackClick = (type: ResponseGrade) => {
    setGrade(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: ensure response generated, grade set
    // if (!isFormValid()) {
    //   alert("Please fill out all required fields before submitting.");
    //   return;
    // }

    const formData = new FormData(e.currentTarget);
    const data = {
      authorId: user.expert.id,
      prompt: formString(formData, "PROMPT") as string,
      // response
      modelResponse: formString(formData, "MODEL_RESPONSE") as string,
      modelName: formString(formData, "MODEL_RESPONSE") as string,

      // review
      veredict: formString(formData, "GRADE") as string,
      critique:
        (formOptString(formData, "CRITIQUE") as string | null) ?? undefined,
      promptImprovement: formOptString(formData, "PROMPT_IMPROVEMENT"),
    };

    await submitTask(data);

    // Log the form data
    console.log("Form submitted with data:", data);

    // Redirect to dashboard
    router.push("/dashboard");
  };

  const hasResponse = response && !loading;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <form className="mx-auto max-w-4xl" onSubmit={handleSubmit}>
        <header className="mb-6 flex items-center">
          <Link href="/dashboard" className="flex items-center text-gray-500">
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
            Back to Dashboard
          </Link>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-primary">New Problem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="problem" className="block text-sm font-medium">
                Write a Problem*
              </label>
              <Textarea
                id={FORMID.PROMPT}
                name={FORMID.PROMPT}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] w-full"
                placeholder="Write a problem for the AI to solve..."
                required
              />
            </div>

            <Button
              onClick={handleAskAI}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Thinking..." : "Generate Response"}
            </Button>

            {loading && (
              <div className="response-container" style={{ lineHeight: 0 }}>
                <span className="loader"></span>
              </div>
            )}
            {error && !loading && (
              <div className="response-container" style={{ lineHeight: 0 }}>
                {error}
              </div>
            )}

            {hasResponse && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    Model&apos;s Response:
                  </h3>
                  {/* <div className="flex gap-2 text-sm">
                    <button
                      type="button"
                      className="text-primary hover:underline"
                    >
                      autofix LaTeX
                    </button>
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => setShowPlaintext(!showPlaintext)}
                    >
                      {showPlaintext ? "hide plaintext" : "show plaintext"}
                    </button>
                  </div> */}
                </div>

                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    {/* TODO RESPONSE BOX */}
                    <input
                      id={FORMID.MODEL_RESPONSE}
                      name={FORMID.MODEL_RESPONSE}
                      type="hidden"
                      value={response.response}
                    />
                    <input
                      id={FORMID.MODEL_NAME}
                      name={FORMID.MODEL_NAME}
                      type="hidden"
                      value={response.modelName}
                    />
                    {response.response}
                  </CardContent>
                </Card>

                <div className="flex items-center gap-4">
                  <input
                    type="hidden"
                    id={FORMID.GRADE}
                    name={FORMID.GRADE}
                    value={grade ?? "none"}
                  />
                  <p className="text-sm font-medium">Was the AI correct?</p>
                  <Button
                    variant="outline"
                    className={`border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 ${
                      grade === "correct" ? "bg-green-50" : ""
                    }`}
                    onClick={() => {
                      handleFeedbackClick("correct");
                    }}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="outline"
                    className={`border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700 ${
                      grade === "unsatisfactory" ? "bg-amber-50" : ""
                    }`}
                    onClick={() => handleFeedbackClick("unsatisfactory")}
                  >
                    Unsatisfactory
                  </Button>
                  <Button
                    variant="outline"
                    className={`border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 ${
                      grade === "incorrect" ? "bg-red-50" : ""
                    }`}
                    onClick={() => handleFeedbackClick("incorrect")}
                  >
                    Incorrect
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {grade === "correct" ? (
          <NextStepsCorrect />
        ) : grade === "unsatisfactory" || grade === "incorrect" ? (
          <NextStepsImprovable grade={grade} />
        ) : null}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-md">
          <div className="mx-auto max-w-4xl flex justify-end">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function NextStepsCorrect() {
  return (
    <Card className="mb-6">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-primary mb-2">Next Steps:</h3>
          <p className="text-gray-700">
            If you had to make this problem more complicated for LLMs, in a way
            you could still solve it yourself (with or without model assistance)
            how would you do it?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Note: You don&apos;t need to modify your question at this time.
          </p>
        </div>

        <div className="space-y-2">
          {/* TODO label for */}
          <h4 className="text-md font-medium text-gray-700">
            Increase Challenge Complexity (Optional)
          </h4>
          <Textarea
            id={FORMID.PROMPT_IMPROVEMENT}
            name={FORMID.PROMPT_IMPROVEMENT}
            placeholder="How would you modify this question to make it even more challenging for the AI?"
            className="min-h-[150px] w-full"
          />
        </div>

        {/* <Button
          variant="outline"
          className="flex items-center gap-2 text-primary hover:bg-primary/10"
        >
          <PlusCircle className="h-4 w-4" />
          Add Another Challenge
        </Button> */}
      </CardContent>
    </Card>
  );
}

function NextStepsImprovable({ grade }: { grade: ResponseGrade }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-primary mb-2">Next Steps:</h3>
          <p className="text-gray-700">
            You&apos;ve indicated that the model&apos;s response was {grade}.
            Please provide your critique to help us understand where the model
            failed:
          </p>
        </div>

        <div className="space-y-2">
          {/* TODO: label for */}
          <h4 className="text-md font-medium text-gray-700">
            Your Critique: Where and why did the model&apos;s response fail?*
          </h4>
          <Textarea
            id={FORMID.CRITIQUE}
            name={FORMID.CRITIQUE}
            placeholder="Explain where and why the model's response was incorrect, inaccurate, or inadequate, including cases where it was error-free but unsatisfactory for your research needs."
            className="min-h-[150px] w-full"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
