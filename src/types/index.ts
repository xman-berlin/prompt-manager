export type VariableType = "text" | "select" | "number";

export interface VariableInput {
  key: string;
  label: string;
  type: VariableType;
  placeholder?: string;
  options?: string[]; // only for type "select"
  order: number;
}

export interface PromptInput {
  title: string;
  description?: string;
  template: string;
  categoryId: string;
  variables: VariableInput[];
}

export interface VariableData {
  id: string;
  key: string;
  label: string;
  type: VariableType;
  placeholder: string | null;
  options: string | null; // JSON string
  order: number;
  promptId: string;
}

export interface CategoryData {
  id: string;
  name: string;
  createdAt: string;
}

export interface PromptData {
  id: string;
  title: string;
  description: string | null;
  template: string;
  categoryId: string;
  category: CategoryData;
  variables: VariableData[];
  createdAt: string;
  updatedAt: string;
}
