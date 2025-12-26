export type UserRole = 'admin' | 'trainer' | 'dse' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinDate?: string;
  points?: number;
  level?: number;
  badges?: Badge[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  modules: number;
  enrolled: number;
  rating: number;
  progress?: number;
  category: string;
  trainer: string;
  isCompleted?: boolean;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  isCompleted: boolean;
  order: number;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  attempts?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  answers: number[];
  completedAt: string;
  passed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  department?: string;
  points: number;
  coursesCompleted: number;
  badges: number;
  id?: string;
  level?: number;
}

