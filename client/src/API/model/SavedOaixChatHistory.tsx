export interface SavedOaixChatHistory {
  userInput: UserInput;
  timestamp: number;
  createdAt: string;
  username: string;
  id: string;
  engine: string;
  chatCompletion: ChatCompletion;
}

export interface UserInput {
  user: string;
  input: string;
  role: string;
}

export interface ChatCompletion {
  body: string;
  headers: Headers;
  statusCode: number;
}

export interface Headers {
  'Access-Control-Expose-Headers': string;
  'Access-Control-Allow-Origin': string;
  'Access-Control-Allow-Methods': string;
  'Access-Control-Allow-Headers': string;
}
