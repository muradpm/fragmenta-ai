"use client";

import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { toast } from "sonner";

import { Info } from "./info";
import { Editor } from "./editor";
import { Content } from "./content";
import { Settings } from "./settings";

import { Question, QuestionType } from "@/types/canvas";

import { useQuery } from "convex/react";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface CanvasProps {
  formId: string;
}

export const Canvas = ({ formId }: CanvasProps) => {
  const questions = useQuery(api.questions.get, { formId }) as Question[];

  const { mutate: updateType } = useApiMutation(api.question.type);
  const { mutate: updateTitle } = useApiMutation(api.question.title);
  const { mutate: updateDescription } = useApiMutation(api.question.description);
  const { mutate: updateChoices } = useApiMutation(api.question.choices);

  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [newType, setNewType] = useState<QuestionType>(QuestionType.Short);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const debouncedSaveTitle = useDebouncedCallback((id, newTitle) => {
    updateTitle({ id, title: newTitle });
  }, 500);

  const debouncedSaveDescription = useDebouncedCallback((id, newDescription) => {
    updateDescription({ id, description: newDescription });
  }, 500);

  const handleTitleChange = (id: string, title: string) => {
    setNewTitle(title);
    debouncedSaveTitle(id, title);
  };

  const handleDescriptionChange = (id: string, description: string) => {
    setNewDescription(description);
    debouncedSaveDescription(id, description);
  };

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    setNewTitle(question.title);
    setNewDescription(question.description || "");
    setNewType(question.type);
  };

  const handleTypeChange = async (id: string, newType: QuestionType) => {
    if (selectedQuestion) {
      try {
        await updateType({ id, type: newType });
        await updateChoices({ id, choices: [] });
        setSelectedQuestion({ ...selectedQuestion, type: newType, choices: [] });
        toast.success("Type updated");
      } catch (error) {
        toast.error("Failed to update type");
      }
    }
  };

  if (!questions) return null;

  return (
    <main className="h-full w-full overflow-hidden relative bg-muted/40 touch-none">
      <Info formId={formId} />
      <div className="flex h-[750px]">
        <Editor
          formId={formId}
          questions={questions}
          onQuestionSelect={handleQuestionSelect}
          selectedQuestion={selectedQuestion}
        />
        <Content
          formId={formId}
          questions={questions}
          selectedQuestion={selectedQuestion}
          newTitle={newTitle}
          newDescription={newDescription}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          updateChoices={updateChoices}
        />
        <Settings
          selectedQuestion={selectedQuestion}
          newType={newType}
          handleTypeChange={handleTypeChange}
        />
      </div>
    </main>
  );
};
