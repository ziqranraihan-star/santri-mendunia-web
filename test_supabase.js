const { createClient } = require('@supabase/supabase-js');
const supabase = createClient("https://qksagkeydvcewlujfyqs.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrc2Fna2V5ZHZjZXdsdWpmeXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzE3MjcsImV4cCI6MjA5NDcwNzcyN30.ETjdbiQFBSv3uiZvB5ymSQ_ltp9qpjBqoWOYnTsQySQ");
async function run() {
  const { data, error } = await supabase.from('pesantren').select('*').limit(1);
  console.log('Pesantren table error:', error?.message);
}
run();
