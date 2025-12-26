// Database types matching your revised Supabase schema

export type RoleType = 'admin' | 'trainer' | 'user';
export type CourseStatus = 'draft' | 'published';
export type BadgeRank = 'bronze' | 'silver' | 'gold' | 'legendary';
export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          email: string;
          full_name: string | null;
          role: RoleType;
          employee_id: string | null;
          created_at: string;
          region: string | null;
        };
        Insert: {
          user_id: string;
          email: string;
          full_name?: string | null;
          role?: RoleType;
          employee_id?: string | null;
          created_at?: string;
          region?: string | null;
        };
        Update: {
          user_id?: string;
          email?: string;
          full_name?: string | null;
          role?: RoleType;
          employee_id?: string | null;
          created_at?: string;
          region?: string | null;
        };
      };
      courses: {
        Row: {
          course_id: string;
          title: string;
          description: string | null;
          category: string | null;
          created_by: string;
          status: CourseStatus;
          created_at: string;
          updated_at: string;
          cover_url: string | null;
        };
        Insert: {
          course_id?: string;
          title: string;
          description?: string | null;
          category?: string | null;
          created_by: string;
          status?: CourseStatus;
          created_at?: string;
          updated_at?: string;
          cover_url?: string | null;
        };
        Update: {
          course_id?: string;
          title?: string;
          description?: string | null;
          category?: string | null;
          created_by?: string;
          status?: CourseStatus;
          created_at?: string;
          updated_at?: string;
          cover_url?: string | null;
        };
      };
      modules: {
        Row: {
          module_id: string;
          course_id: string;
          title: string;
          video_url: string | null;
          doc_url: string | null;
          order_sequence: number;
          created_at: string;
          xp_amounts: number | null;
          content_text: string | null;
          duration_minutes: number | null;
        };
        Insert: {
          module_id?: string;
          course_id: string;
          title: string;
          video_url?: string | null;
          doc_url?: string | null;
          order_sequence: number;
          created_at?: string;
          xp_amounts?: number | null;
          content_text?: string | null;
          duration_minutes?: number | null;
        };
        Update: {
          module_id?: string;
          course_id?: string;
          title?: string;
          video_url?: string | null;
          doc_url?: string | null;
          order_sequence?: number;
          created_at?: string;
          xp_amounts?: number | null;
          content_text?: string | null;
          duration_minutes?: number | null;
        };
      };
      quizzes: {
        Row: {
          quiz_id: string;
          module_id: string;
          title: string;
          min_score: number;
          passing_score: number | null;
          is_timed: number | null;
          time_limit_second: string;
          xp_bonus: number | null;
        };
        Insert: {
          quiz_id?: string;
          module_id: string;
          title: string;
          min_score?: number;
          passing_score?: number | null;
          is_timed?: number | null;
          time_limit_second?: string;
          xp_bonus?: number | null;
        };
        Update: {
          quiz_id?: string;
          module_id?: string;
          title?: string;
          min_score?: number;
          passing_score?: number | null;
          is_timed?: number | null;
          time_limit_second?: string;
          xp_bonus?: number | null;
        };
      };
      questions: {
        Row: {
          question_id: string;
          quiz_id: string;
          question_text: string;
          explanation: string | null;
          point: number | null;
        };
        Insert: {
          question_id?: string;
          quiz_id: string;
          question_text: string;
          explanation?: string | null;
          point?: number | null;
        };
        Update: {
          question_id?: string;
          quiz_id?: string;
          question_text?: string;
          explanation?: string | null;
          point?: number | null;
        };
      };
      answers: {
        Row: {
          answer_id: string;
          question_id: string;
          answer_text: string;
          is_correct: boolean;
        };
        Insert: {
          answer_id?: string;
          question_id: string;
          answer_text: string;
          is_correct?: boolean;
        };
        Update: {
          answer_id?: string;
          question_id?: string;
          answer_text?: string;
          is_correct?: boolean;
        };
      };
      enrollments: {
        Row: {
          enrollment_id: string;
          user_id: string;
          course_id: string;
          status: EnrollmentStatus;
          progress_percentage: number;
          enrollment_at: string;
          completed_at: string | null;
        };
        Insert: {
          enrollment_id?: string;
          user_id: string;
          course_id: string;
          status?: EnrollmentStatus;
          progress_percentage?: number;
          enrollment_at: string;
          completed_at?: string | null;
        };
        Update: {
          enrollment_id?: string;
          user_id?: string;
          course_id?: string;
          status?: EnrollmentStatus;
          progress_percentage?: number;
          enrollment_at?: string;
          completed_at?: string | null;
        };
      };
      module_progress: {
        Row: {
          progress_id: string;
          enrollment_id: string;
          module_id: string;
          is_video_watched: boolean;
          is_quiz_passed: boolean;
          highest_quiz_score: number;
          updated_at: string;
        };
        Insert: {
          progress_id?: string;
          enrollment_id: string;
          module_id: string;
          is_video_watched?: boolean;
          is_quiz_passed?: boolean;
          highest_quiz_score?: number;
          updated_at?: string;
        };
        Update: {
          progress_id?: string;
          enrollment_id?: string;
          module_id?: string;
          is_video_watched?: boolean;
          is_quiz_passed?: boolean;
          highest_quiz_score?: number;
          updated_at?: string;
        };
      };
      certificates: {
        Row: {
          certificate_id: string;
          enrollment_id: string;
          certificate_code: string;
          file_url: string | null;
          issued_at: string;
        };
        Insert: {
          certificate_id?: string;
          enrollment_id: string;
          certificate_code: string;
          file_url?: string | null;
          issued_at?: string;
        };
        Update: {
          certificate_id?: string;
          enrollment_id?: string;
          certificate_code?: string;
          file_url?: string | null;
          issued_at?: string;
        };
      };
      badges: {
        Row: {
          badge_id: string;
          name: string;
          description: string | null;
          rank: BadgeRank;
          criteria_rule: number;
          created_at: string;
          user_id: string | null;
          xp_total: number | null;
          source: string | null;
        };
        Insert: {
          badge_id?: string;
          name: string;
          description?: string | null;
          rank: BadgeRank;
          criteria_rule: number;
          created_at?: string;
          user_id?: string | null;
          xp_total?: number | null;
          source?: string | null;
        };
        Update: {
          badge_id?: string;
          name?: string;
          description?: string | null;
          rank?: BadgeRank;
          criteria_rule?: number;
          created_at?: string;
          user_id?: string | null;
          xp_total?: number | null;
          source?: string | null;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Module = Database['public']['Tables']['modules']['Row'];
export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type Question = Database['public']['Tables']['questions']['Row'];
export type Answer = Database['public']['Tables']['answers']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type ModuleProgress = Database['public']['Tables']['module_progress']['Row'];
export type Certificate = Database['public']['Tables']['certificates']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
