export enum GameStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Finished = 'Finished',
  Abandoned = 'Abandoned'
}

export interface Game {
  id: string;
  title: string;
  description: string;
  genre: string;
  status: GameStatus;
  rating: number; // 0 to 5
  coverImage?: string; // Main image
  gallery: string[]; // Additional images
  addedAt: number;
}

export interface GameAISuggestion {
  description: string;
  genre: string;
}
