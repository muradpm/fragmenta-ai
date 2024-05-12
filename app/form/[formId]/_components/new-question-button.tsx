"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Hint } from "@/components/hint";

import { Plus, LoaderCircle } from "lucide-react";

import { useQuery } from "convex/react";

import { useApiMutation } from "@/hooks/use-api-mutation";

import { api } from "@/convex/_generated/api";

interface NewQuestionButtonProps {
  formId: string;
}

export const NewQuestionButton = ({ formId }: NewQuestionButtonProps) => {
  const data = useQuery(api.questions.count, { formId });
  const { mutate, pending } = useApiMutation(api.question.create);

  const onClick = () => {
    const position = data ?? 0;

    mutate({
      formId,
      title: "Untitled",
      description: "Description (optional)",
      type: "Type your answer here...",
      position,
    })
      .then(() => {
        toast.success("Question created");
      })
      .catch(() => toast.error("Failed to create question"));
  };

  return (
    <div>
      <Hint label="Add question" side="bottom" sideOffset={10}>
        <Button variant="outline" size="icon" onClick={onClick} disabled={pending}>
          {pending ? (
            <LoaderCircle className="animate-spin w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </Hint>
    </div>
  );
};
