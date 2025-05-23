"use client";

import { useEffect } from "react";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { NewQuestionButton } from "@/components/new-question-button";

import { QuestionItem } from "@/components/question-item";

import { Question } from "@/types/canvas";

import { cn } from "@/lib/utils";

import { toast } from "sonner";

import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface EditorProps {
  formId: string;
  questions: Question[];
  onQuestionSelect: (question: Question) => void;
  selectedQuestion: Question | null;
}

function reorder<T>(questions: T[], startIndex: number, endIndex: number) {
  if (!questions) return [];

  const result = Array.from(questions);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const Editor = ({
  formId,
  questions,
  onQuestionSelect,
  selectedQuestion,
}: EditorProps) => {
  const reorderQuestion = useMutation(api.questions.position).withOptimisticUpdate(
    (localStore, { id, position }) => {
      const currentQuestions = localStore.getQuery(api.questions.get, { formId });

      if (currentQuestions) {
        const reorderedQuestions = reorder(
          currentQuestions,
          currentQuestions.findIndex((question) => question._id === id),
          position
        );

        localStore.setQuery(api.questions.get, { formId }, reorderedQuestions);
      }
    }
  );

  const onDragEnd = async (result: any) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    const newOrderedQuestion = reorder(questions, source.index, destination.index);

    const reorderPromise = Promise.all(
      newOrderedQuestion.map((question, index) =>
        reorderQuestion({
          id: question._id as Id<"questions">,
          formId: formId,
          position: index,
        })
      )
    );

    toast.promise(reorderPromise, {
      loading: "Reordering...",
      success: "Questions reordered",
      error: "Failed to reorder questions",
    });
  };

  useEffect(() => {
    if (questions.length > 0 && !selectedQuestion) {
      onQuestionSelect(questions[0]);
    }
  }, [questions, selectedQuestion, onQuestionSelect]);

  return (
    <div className="flex flex-col h-full w-64 border rounded-tr-md bg-background">
      <div className="flex items-center justify-between p-2">
        <div className="font-semibold">Questions</div>
        <NewQuestionButton formId={formId} />
      </div>
      <div className="flex-1 text-sm text-muted-foreground overflow-y-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <ol {...provided.droppableProps} ref={provided.innerRef}>
                {questions.map((question, index) => (
                  <QuestionItem
                    index={index}
                    key={question._id}
                    question={question}
                    onClick={() => onQuestionSelect(question)}
                    className={cn({
                      "text-foreground bg-primary/10":
                        selectedQuestion && question._id === selectedQuestion._id,
                    })}
                  />
                ))}
                {provided.placeholder}
              </ol>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
