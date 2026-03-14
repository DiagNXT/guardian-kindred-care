import { createClient } from '@supabase/supabase-js';

// New Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ounifpinkqybkydxuvbq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bmlmcGlua3F5Ymt5ZHh1dmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwODgyNzUsImV4cCI6MjA4NzY2NDI3NX0.xlWFBsQg9VjCt1eAI_XGBmck73eANA0oNAfZbtVoN4Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
