import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vhipbimjsejfybffzgyj.supabase.co'

const supabaseKey = 'sb_publishable_fT9lvA6iiPVVVs_H7iH5Gg_9_FwbzX1'

export const supabase = createClient(supabaseUrl, supabaseKey)