
import { createClient } from '@supabase/supabase-js';

// Connection details provided for project: smatromfcrduzpipjwot
const supabaseUrl = process.env.SUPABASE_URL || 'https://smatromfcrduzpipjwot.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYXRyb21mY3JkdXpwaXBqd290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTkwMDYsImV4cCI6MjA4MzI5NTAwNn0.Xz9-8BC-XRXgKiGJRh8uvSULmeES84jYXl7YVYt3MkY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Note: Ensure the following tables exist in your Supabase project:
 * 
 * 1. `submissions`:
 *    - id (text, primary key)
 *    - userId (text)
 *    - userName (text)
 *    - timestamp (timestamptz)
 *    - location (jsonb)
 *    - region (text)
 *    - imageUrl (text)
 *    - type (text)
 *    - status (text)
 *    - aiScore (float)
 *    - aiReasoning (text)
 *    - detectedFeatures (jsonb)
 *    - environmentalContext (text)
 *    - googleMapsUrl (text)
 *    - creditsGenerated (float)
 *    - blockchainHash (text)
 *    - auditTrail (jsonb)
 * 
 * 2. `credits`:
 *    - id (text, primary key)
 *    - submissionId (text)
 *    - amount (float)
 *    - vintage (text)
 *    - status (text)
 *    - ownerId (text, optional)
 *    - purchaseDate (timestamptz, optional)
 */
