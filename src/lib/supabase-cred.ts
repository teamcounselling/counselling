import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://poptklbkuamytrzcgeiy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvcHRrbGJrdWFteXRyemNnZWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDYyNjIsImV4cCI6MjA2OTM4MjI2Mn0.ygszt60k4x5C339_Xw_NRT9tkF5VqNemPa_KGVGpWA8';

export const supabase = createClient(supabaseUrl, supabaseKey);
