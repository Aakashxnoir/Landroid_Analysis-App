import { supabase } from './supabaseClient';

/**
 * Generic Database Service for Supabase CRUD
 * Designed to be reusable across multiple tables.
 */
const DatabaseService = {
  /**
   * Create a new record in a table
   */
  create: async <T>(table: string, data: Partial<T>) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { data: result, error: null };
    } catch (error: any) {
      console.error(`[DatabaseService] Create error for table ${table}:`, error);
      return { data: null, error: error.message || 'Create failed' };
    }
  },

  /**
   * Fetch all records from a table
   */
  fetchAll: async <T>(table: string, query?: object) => {
    try {
      let request = supabase.from(table).select('*');
      
      // Basic query support if needed
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          request = request.eq(key, value);
        });
      }

      const { data, error } = await request.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error(`[DatabaseService] Fetch error for table ${table}:`, error);
      return { data: null, error: error.message || 'Fetch failed' };
    }
  },

  /**
   * Fetch a single record by ID
   */
  fetchById: async <T>(table: string, id: string | number) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error(`[DatabaseService] ID Fetch error for table ${table}:`, error);
      return { data: null, error: error.message || 'Fetch failed' };
    }
  },

  /**
   * Update a record by ID
   */
  update: async <T>(table: string, id: string | number, updates: Partial<T>) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error(`[DatabaseService] Update error for table ${table}:`, error);
      return { data: null, error: error.message || 'Update failed' };
    }
  },

  /**
   * Delete a record by ID
   */
  remove: async (table: string, id: string | number) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error(`[DatabaseService] Delete error for table ${table}:`, error);
      return { error: error.message || 'Delete failed' };
    }
  },
};

export default DatabaseService;
