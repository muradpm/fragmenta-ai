"use client";

import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { RadioCard, RadioCardItem } from "@/components/ui/radio-card";

interface YesNoChoiceProps {
  id: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  updateChoices: (choices: { id: string; choices: string[] }) => Promise<void>;
}

export const YesNoChoice = ({
  id,
  value,
  options: initialOptions,
  onChange,
  updateChoices,
}: YesNoChoiceProps) => {
  const defaultOptions =
    initialOptions.length > 0
      ? initialOptions
      : [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ];

  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [options, setOptions] = useState(defaultOptions);

  const debouncedUpdateChoices = useDebouncedCallback(
    (updatedOptions: { label: string; value: string }[]) => {
      updateChoices({
        id,
        choices: updatedOptions.map((option) => option.label),
      });
    },
    500
  );

  const handleLabelChange = (value: string, index: number) => {
    setOptions((currentOptions) => {
      const newOptions = [...currentOptions];
      newOptions[index].label = value;
      debouncedUpdateChoices(newOptions);
      return newOptions;
    });
  };

  const handleOptionClick = (optionValue: string) => {
    if (editingOption !== null) {
      debouncedUpdateChoices.flush();
    }
    setEditingOption(optionValue);
    onChange(optionValue);
  };

  const handleBlur = () => {
    if (editingOption !== null) {
      debouncedUpdateChoices.flush();
      setEditingOption(null);
    }
  };

  return (
    <div className="w-full">
      <div className="max-h-64 overflow-y-auto">
        <RadioCard>
          {options.map((option, index) => (
            <RadioCardItem
              key={option.value}
              value={option.value}
              label={
                editingOption === option.value ? (
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) => handleLabelChange(e.target.value, index)}
                    onBlur={handleBlur}
                    className="bg-transparent border-none focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <span onClick={() => handleOptionClick(option.value)}>
                    {option.label}
                  </span>
                )
              }
              checked={value === option.value}
            ></RadioCardItem>
          ))}
        </RadioCard>
      </div>
    </div>
  );
};
