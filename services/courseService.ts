import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

export type CourseRow = Database['public']['Tables']['courses']['Row'];
export type CourseInsert = Database['public']['Tables']['courses']['Insert'];
export type CourseUpdate = Database['public']['Tables']['courses']['Update'];
export type ModuleRow = Database['public']['Tables']['modules']['Row'];
export type ModuleInsert = Database['public']['Tables']['modules']['Insert'];
export type ModuleUpdate = Database['public']['Tables']['modules']['Update'];

export async function getMyCourses(): Promise<{ data: CourseRow[]; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: data as CourseRow[] };
  } catch (e: any) {
    return { data: [], error: e?.message ?? 'Failed to fetch courses' };
  }
}

export async function createCourse(input: Omit<CourseInsert, 'course_id' | 'created_by' | 'status' | 'created_at' | 'updated_at'> & { status?: CourseInsert['status'] }): Promise<{ data?: CourseRow; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const payload: CourseInsert = {
      title: input.title,
      description: input.description ?? null,
      category: input.category ?? null,
      created_by: user.id,
      status: input.status ?? 'draft',
    };

    const { data, error } = await supabase
      .from('courses')
      .insert(payload)
      .select('*')
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { error: 'Insert failed' };
    return { data: data as CourseRow };
  } catch (e: any) {
    return { error: e?.message ?? 'Failed to create course' };
  }
}

export async function updateCourse(courseId: string, updates: CourseUpdate): Promise<{ data?: CourseRow; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('courses')
      // @ts-ignore
      .update(updates)
      .eq('course_id', courseId)
      .select('*')
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { error: 'Update failed' };
    return { data: data as CourseRow };
  } catch (e: any) {
    return { error: e?.message ?? 'Failed to update course' };
  }
}

export async function publishCourse(courseId: string): Promise<{ data?: CourseRow; error?: string }> {
  return updateCourse(courseId, { status: 'published' });
}

export async function listModules(courseId: string): Promise<{ data: ModuleRow[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_sequence', { ascending: true });
    if (error) return { data: [], error: error.message };
    return { data: data as ModuleRow[] };
  } catch (e: any) {
    return { data: [], error: e?.message ?? 'Failed to fetch modules' };
  }
}

export async function addModule(courseId: string, input: Omit<ModuleInsert, 'module_id' | 'course_id' | 'created_at'>): Promise<{ data?: ModuleRow; error?: string }> {
  try {
    const payload: ModuleInsert = {
      course_id: courseId,
      title: input.title,
      video_url: input.video_url ?? null,
      doc_url: input.doc_url ?? null,
      content_text: input.content_text ?? null,
      order_sequence: input.order_sequence,
    };

    const { data, error } = await supabase
      .from('modules')
      .insert(payload)
      .select('*')
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { error: 'Insert failed' };
    return { data: data as ModuleRow };
  } catch (e: any) {
    return { error: e?.message ?? 'Failed to add module' };
  }
}

export async function updateModule(moduleId: string, updates: ModuleUpdate): Promise<{ data?: ModuleRow; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('modules')
      .update(updates)
      .eq('module_id', moduleId)
      .select('*')
      .maybeSingle();

    if (error) return { error: error.message };
    if (!data) return { error: 'Update failed' };
    return { data: data as ModuleRow };
  } catch (e: any) {
    return { error: e?.message ?? 'Failed to update module' };
  }
}
