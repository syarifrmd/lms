import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Course, Module, Quiz, QuizResult, Badge, LeaderboardEntry, UserRole } from '../types';
import "../global.css";
// Re-export for convenience
export type { UserRole, QuizResult, Course, Module, Quiz, Badge, User };

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  modules: Module[];
  quizzes: Quiz[];
  quizResults: QuizResult[];
  addQuizResult: (result: QuizResult) => void;
  leaderboard: LeaderboardEntry[];
  updateModuleProgress: (moduleId: string, completed: boolean) => void;
  updateCourseProgress: (courseId: string) => void;
  users: User[];
  badges: Badge[];
  earnBadge: (badgeId: string, userId: string) => void;
  showLanding: boolean;
  setShowLanding: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@indosat.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    department: 'Administration',
    joinDate: '2023-01-01',
  },
  {
    id: '2',
    name: 'Trainer Ahmad',
    email: 'ahmad@indosat.com',
    role: 'trainer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmad',
    department: 'Training',
    joinDate: '2023-02-15',
  },
  {
    id: '3',
    name: 'Budi Santoso',
    email: 'budi@indosat.com',
    role: 'dse',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi',
    department: 'Sales',
    joinDate: '2023-06-01',
    points: 2850,
    level: 8,
  },
  {
    id: '4',
    name: 'Siti Nurhaliza',
    email: 'siti@indosat.com',
    role: 'dse',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
    department: 'Sales',
    joinDate: '2023-05-15',
    points: 3200,
    level: 9,
  },
  {
    id: '5',
    name: 'Rizky Pratama',
    email: 'rizky@indosat.com',
    role: 'dse',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizky',
    department: 'Sales',
    joinDate: '2023-07-10',
    points: 2100,
    level: 6,
  },
];

const mockBadges: Badge[] = [
  {
    id: 'b1',
    name: 'First Steps',
    description: 'Complete your first course',
    icon: '🎯',
    rarity: 'common',
  },
  {
    id: 'b2',
    name: 'Quick Learner',
    description: 'Complete 5 courses',
    icon: '⚡',
    rarity: 'rare',
  },
  {
    id: 'b3',
    name: 'Quiz Master',
    description: 'Pass 10 quizzes with 100% score',
    icon: '🏆',
    rarity: 'epic',
  },
  {
    id: 'b4',
    name: 'Sales Champion',
    description: 'Complete all sales training modules',
    icon: '👑',
    rarity: 'legendary',
  },
  {
    id: 'b5',
    name: 'Streak Legend',
    description: 'Learn for 30 consecutive days',
    icon: '🔥',
    rarity: 'epic',
  },
];

const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Product Knowledge: Indosat IM3 Ooredoo',
    description: 'Comprehensive training on IM3 Ooredoo products, features, and selling points',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    duration: '2 hours',
    modules: 6,
    enrolled: 145,
    rating: 4.8,
    category: 'Product Knowledge',
    trainer: 'Trainer Ahmad',
    progress: 60,
  },
  {
    id: 'c2',
    title: 'Sales Technique & Communication',
    description: 'Master effective sales techniques and customer communication strategies',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    duration: '3 hours',
    modules: 8,
    enrolled: 198,
    rating: 4.9,
    category: 'Sales Skills',
    trainer: 'Trainer Ahmad',
    progress: 30,
  },
  {
    id: 'c3',
    title: 'Digital Services & Apps',
    description: 'Learn about Indosat digital services, apps, and value-added services',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    duration: '1.5 hours',
    modules: 5,
    enrolled: 132,
    rating: 4.7,
    category: 'Product Knowledge',
    trainer: 'Trainer Ahmad',
    progress: 0,
  },
  {
    id: 'c4',
    title: 'Customer Service Excellence',
    description: 'Deliver outstanding customer service and handle complaints effectively',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    duration: '2.5 hours',
    modules: 7,
    enrolled: 167,
    rating: 4.8,
    category: 'Soft Skills',
    trainer: 'Trainer Ahmad',
    progress: 100,
    isCompleted: true,
  },
  {
    id: 'c5',
    title: 'Network Technology Basics',
    description: 'Understanding 4G, 5G, and network infrastructure basics',
    thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    duration: '2 hours',
    modules: 6,
    enrolled: 89,
    rating: 4.6,
    category: 'Technical',
    trainer: 'Trainer Ahmad',
    progress: 0,
  },
  {
    id: 'c6',
    title: 'Competitive Analysis',
    description: 'Analyze competitors and position Indosat products effectively',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    duration: '1.5 hours',
    modules: 4,
    enrolled: 112,
    rating: 4.7,
    category: 'Sales Skills',
    trainer: 'Trainer Ahmad',
    progress: 0,
  },
];

const mockModules: Module[] = [
  {
    id: 'm1',
    courseId: 'c1',
    title: 'Introduction to IM3 Ooredoo',
    description: 'Overview of IM3 Ooredoo brand and positioning',
    duration: '15 min',
    videoUrl: 'https://example.com/video1',
    isCompleted: true,
    order: 1,
  },
  {
    id: 'm2',
    courseId: 'c1',
    title: 'IM3 Product Portfolio',
    description: 'Detailed look at all IM3 products and packages',
    duration: '20 min',
    videoUrl: 'https://example.com/video2',
    isCompleted: true,
    order: 2,
  },
  {
    id: 'm3',
    courseId: 'c1',
    title: 'Features & Benefits',
    description: 'Key features and customer benefits',
    duration: '18 min',
    videoUrl: 'https://example.com/video3',
    isCompleted: true,
    order: 3,
  },
  {
    id: 'm4',
    courseId: 'c1',
    title: 'Pricing Strategy',
    description: 'Understanding pricing and promotional strategies',
    duration: '22 min',
    videoUrl: 'https://example.com/video4',
    isCompleted: false,
    order: 4,
  },
  {
    id: 'm5',
    courseId: 'c1',
    title: 'Target Market',
    description: 'Identifying and reaching target customers',
    duration: '17 min',
    videoUrl: 'https://example.com/video5',
    isCompleted: false,
    order: 5,
  },
  {
    id: 'm6',
    courseId: 'c1',
    title: 'Sales Script & Techniques',
    description: 'Effective sales scripts for IM3 products',
    duration: '25 min',
    videoUrl: 'https://example.com/video6',
    isCompleted: false,
    order: 6,
  },
];

const mockQuizzes: Quiz[] = [
  {
    id: 'q1',
    moduleId: 'm1',
    title: 'IM3 Ooredoo Basics Quiz',
    passingScore: 70,
    timeLimit: 10,
    attempts: 3,
    questions: [
      {
        id: 'q1q1',
        question: 'What is the main target demographic for IM3 Ooredoo?',
        options: ['Young adults 18-30', 'Business professionals', 'Seniors 60+', 'Children'],
        correctAnswer: 0,
        explanation: 'IM3 Ooredoo primarily targets young adults aged 18-30 who are digital natives.',
      },
      {
        id: 'q1q2',
        question: 'Which of the following is a key feature of IM3 Ooredoo?',
        options: ['Free landline calls', 'Unlimited social media data', '5G home internet', 'Satellite phone'],
        correctAnswer: 1,
        explanation: 'IM3 Ooredoo offers unlimited data for popular social media apps.',
      },
      {
        id: 'q1q3',
        question: 'What makes IM3 Ooredoo different from competitors?',
        options: ['Lowest price only', 'Digital-first approach and flexibility', 'Physical stores only', 'Corporate focus'],
        correctAnswer: 1,
        explanation: 'IM3 Ooredoo differentiates through its digital-first approach and flexible packages.',
      },
    ],
  },
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: '4',
    name: 'Siti Nurhaliza',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siti',
    points: 3200,
    coursesCompleted: 8,
    badges: 5,
  },
  {
    rank: 2,
    userId: '3',
    name: 'Budi Santoso',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi',
    points: 2850,
    coursesCompleted: 7,
    badges: 4,
  },
  {
    rank: 3,
    userId: '5',
    name: 'Rizky Pratama',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizky',
    points: 2100,
    coursesCompleted: 5,
    badges: 3,
  },
  {
    rank: 4,
    userId: '6',
    name: 'Dewi Lestari',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dewi',
    points: 1950,
    coursesCompleted: 5,
    badges: 3,
  },
  {
    rank: 5,
    userId: '7',
    name: 'Andi Wijaya',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=andi',
    points: 1800,
    coursesCompleted: 4,
    badges: 2,
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [quizzes] = useState<Quiz[]>(mockQuizzes);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [leaderboard] = useState<LeaderboardEntry[]>(mockLeaderboard);
  const [users] = useState<User[]>(mockUsers);
  const [badges] = useState<Badge[]>(mockBadges);
  const [showLanding, setShowLanding] = useState<boolean>(true);

  const updateModuleProgress = (moduleId: string, completed: boolean) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, isCompleted: completed } : m))
    );
  };

  const updateCourseProgress = (courseId: string) => {
    const courseModules = modules.filter((m) => m.courseId === courseId);
    const completedModules = courseModules.filter((m) => m.isCompleted).length;
    const progress = Math.round((completedModules / courseModules.length) * 100);

    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, progress, isCompleted: progress === 100 }
          : c
      )
    );
  };

  const addQuizResult = (result: QuizResult) => {
    setQuizResults((prev) => [...prev, result]);
  };

  const earnBadge = (badgeId: string, userId: string) => {
    // Logic to award badge to user
    console.log(`Badge ${badgeId} earned by user ${userId}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        courses,
        setCourses,
        modules,
        quizzes,
        quizResults,
        addQuizResult,
        leaderboard,
        updateModuleProgress,
        updateCourseProgress,
        users,
        badges,
        earnBadge,
        showLanding,
        setShowLanding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

