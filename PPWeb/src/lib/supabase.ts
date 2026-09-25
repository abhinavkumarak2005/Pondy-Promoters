import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = SUPABASE_URL?.startsWith('https://') && SUPABASE_ANON_KEY?.length > 20

export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

export interface DBProperty {
  id: number
  name: string
  location: string
  price: string
  type: string
  sqft: string | null
  beds: number | null
  baths: number | null
  description: string | null
  tags: string[]
  image_url: string | null
  instagram_link: string | null
  is_featured: boolean
  featured_order: number | null
  created_at: string
}

export async function fetchFeaturedProperties(): Promise<DBProperty[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .limit(5)
    if (error) throw error
    return data || []
  } catch (e) { console.warn('Supabase:', e); return [] }
}

export async function fetchAllProperties(): Promise<DBProperty[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (e) { console.warn('Supabase:', e); return [] }
}

export async function submitContact(form: Record<string, string>) {
  if (!supabase) return { error: null } // silently succeed offline
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{ ...form, submitted_at: new Date().toISOString() }])
    return { error }
  } catch (e) { return { error: e } }
}

// Relevance search: exact location > type match > partial match
export function scoreProperty(p: DBProperty, query: string): number {
  if (!query) return 0
  const q = query.toLowerCase()
  const loc = (p.location || '').toLowerCase()
  const type = (p.type || '').toLowerCase()
  const name = (p.name || '').toLowerCase()
  const tags = (p.tags || []).join(' ').toLowerCase()

  let score = 0
  if (loc.startsWith(q)) score += 100
  else if (loc.includes(q)) score += 60
  if (name.includes(q)) score += 50
  if (type.includes(q)) score += 40
  if (tags.includes(q)) score += 30
  // Partial word match
  const words = q.split(' ')
  for (const w of words) {
    if (w.length > 2) {
      if (loc.includes(w)) score += 20
      if (name.includes(w)) score += 15
    }
  }
  return score
}
