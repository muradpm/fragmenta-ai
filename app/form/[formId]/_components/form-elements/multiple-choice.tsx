"use client";

import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { CheckboxCard, CheckboxCardItem } from "@/components/ui/checkbox-card";

import { toast } from "sonner";

interface MultipleChoiceProps {
  values: string[];
  options: { label: string; value: string }[];
  questionId: string;
  onChange: (value: string[]) => void;
  updateChoices: (choices: { id: string; choices: string[] }) => Promise<void>;
}

export const MultipleChoice = ({
  values,
  options: initialOptions,
  questionId,
  onChange,
  updateChoices,
}: MultipleChoiceProps) => {
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [options, setOptions] = useState(initialOptions);

  const debouncedUpdateLabel = useDebouncedCallback(
    (updatedOptions: { label: string; value: string }[]) => {
      updateChoices({
        id: questionId,
        choices: updatedOptions.map((option) => option.label),
      });
    },
    500
  );

  const handleLabelChange = (value: string, index: number) => {
    setOptions((currentOptions) => {
      const newOptions = [...currentOptions];
      newOptions[index].label = value;
      debouncedUpdateLabel(newOptions);
      return newOptions;
    });
  };

  const handleOptionClick = (optionValue: string) => {
    if (editingOption !== null) {
      debouncedUpdateLabel.flush();
    }
    setEditingOption(optionValue);
  };

  const handleAddChoice = () => {
    const newChoiceLabel = "New choice";
    const newChoice = { label: newChoiceLabel, value: `new-${Date.now()}` };
    const updatedOptions = [...options, newChoice];

    setOptions(updatedOptions);
    updateChoices({
      id: questionId,
      choices: updatedOptions.map((option) => option.label),
    })
      .then(() => {
        toast.success("Choice created");
      })
      .catch(() => {
        toast.error("Failed to create choice");
      });
  };

  return (
    <div className="w-full">
      <div className="max-h-64 overflow-y-auto">
        <CheckboxCard>
          {options.map((option, index) => (
            <CheckboxCardItem
              key={option.value}
              value={option.value}
              label={
                editingOption === option.value ? (
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleLabelChange(e.target.value, index)}
                    className="bg-transparent border-none focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleOptionClick(option.value)}>
                    {option.label}
                  </span>
                )
              }
              checked={values.includes(option.value)}
            />
          ))}
        </CheckboxCard>
      </div>
      <div className="mt-2 mx-2 text-xs font-light text-muted-foreground hover:text-primary">
        <button onClick={handleAddChoice}>Add new choice</button>
      </div>
    </div>
  );
};
