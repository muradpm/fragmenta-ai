export interface Question {
  _id: string;
  title: string;
  description?: string;
  type: QuestionType;
  position: number;
  formId: string;
}

export enum QuestionType {
  Short = "Short text",
  Long = "Long text",
  YesNo = "Yes/no choice",
  Multiple = "Multiple choice",
  Rating = "Rating",
}
