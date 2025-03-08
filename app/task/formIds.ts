export const FORMID = {
  PROMPT: `task-prompt`,
  MODEL_NAME: `task-model-name`,
  MODEL_RESPONSE: `task-model-response`,

  GRADE: `task-grade`, // correct, incorrect, unsatisfactory
  CRITIQUE: `task-critique`, // if incorrect, what did the model get wrong
  PROMPT_IMPROVEMENT: `task-prompt-improvement`, // if correct, what did the model get right
  CORRECT_SOLUTION: "task-correct-solution",
} as const;
