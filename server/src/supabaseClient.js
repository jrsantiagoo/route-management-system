import { createClient } from "@supabase/supabase-js";

let supabaseInstance = null;

// Use a Proxy to lazily initialize the Supabase client when it's first used
export default new Proxy({}, {
  get(target, prop) {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase environment variables (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
      }

      supabaseInstance = createClient(supabaseUrl, supabaseKey);
    }

    return supabaseInstance[prop];
  }
});
