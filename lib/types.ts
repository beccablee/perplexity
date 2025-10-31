export type WebDoc = {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  image?: string;
  favicon?: string;
};

export type AskInput = { query: string };
export type AskOutput = {
  answer: string;
  citations: Array<{ id: string; url: string; title?: string }>;
};
