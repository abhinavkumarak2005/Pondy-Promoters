import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = SUPABASE_URL?.startsWith('https://') && SUPABASE_ANON_KEY?.length > 20

export const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null

const guard = (fn) => async (...args) => {
  if (!supabase) { console.warn('Add .env with Supabase credentials'); return { data: [], error: null } }
  try { return await fn(...args) } catch (e) { return { data: [], error: e } }
}

export const getProperties = guard(async () => {
  const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
  return { data: data || [], error }
})

export const createProperty = guard(async (prop) => {
  const { data, error } = await supabase.from('properties').insert([prop]).select()
  return { data, error }
})

export const updateProperty = guard(async (id, updates) => {
  const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select()
  return { data, error }
})

export const deleteProperty = guard(async (id) => {
  const { error } = await supabase.from('properties').delete().eq('id', id)
  return { error }
})

export async function uploadImage(file, propertyName) {
  if (!supabase) return { url: null, error: new Error('Supabase not configured') }
  try {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${propertyName.replace(/\s+/g,'-').toLowerCase()}.${ext}`
    const { error } = await supabase.storage.from('property-images').upload(fileName, file)
    if (error) return { url: null, error }
    const { data } = supabase.storage.from('property-images').getPublicUrl(fileName)
    return { url: data.publicUrl, error: null }
  } catch (e) { return { url: null, error: e } }
}

export async function setFeatured(ids) {
  if (!supabase) return { error: new Error('Supabase not configured') }
  try {
    await supabase.from('properties').update({ is_featured: false, featured_order: null }).neq('id', 0)
    for (let i = 0; i < ids.length; i++) {
      await supabase.from('properties').update({ is_featured: true, featured_order: i + 1 }).eq('id', ids[i])
    }
    return { error: null }
  } catch (e) { return { error: e } }
}

export const getSubscribers = guard(async () => {
  const { data, error } = await supabase.from('subscribers').select('*').order('subscribed_at', { ascending: false })
  return { data: data || [], error }
})

export const deleteSubscriber = guard(async (id) => {
  const { error } = await supabase.from('subscribers').delete().eq('id', id)
  return { error }
})

export const getContacts = guard(async () => {
  const { data, error } = await supabase.from('contact_submissions').select('*').order('submitted_at', { ascending: false })
  return { data: data || [], error }
})

export const markContactRead = guard(async (id) => {
  const { error } = await supabase.from('contact_submissions').update({ is_read: true }).eq('id', id)
  return { error }
})

export const deleteContact = guard(async (id) => {
  const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
  return { error }
})
