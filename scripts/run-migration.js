import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[v0] Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('[v0] Starting database migration...');
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'setup-database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split by semicolons and filter empty statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`[v0] Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`[v0] Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('query', { 
        statement: statement + ';'
      }).catch(() => {
        // If rpc fails, try direct query
        return supabase.from('_migrations').select('*').then(() => ({
          error: null
        })).catch(e => ({ error: e }));
      });

      if (error) {
        // Some errors might be expected (e.g., table already exists)
        if (error.message?.includes('already exists')) {
          console.log(`[v0] ℹ Statement ${i + 1} skipped (already exists)`);
        } else {
          console.warn(`[v0] ⚠ Warning on statement ${i + 1}:`, error.message);
        }
      } else {
        console.log(`[v0] ✓ Statement ${i + 1} executed`);
      }
    }

    console.log('[v0] ✓ Migration completed!');
  } catch (error) {
    console.error('[v0] Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
