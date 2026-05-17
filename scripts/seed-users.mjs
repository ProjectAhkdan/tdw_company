// Script: seed users ke public.users + buat akun admin
// Jalankan: node scripts/seed-users.mjs

const SUPABASE_URL = 'https://rgwquajbnjghbyzyxwxc.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd3F1YWpibmpnaGJ5enl4d3hjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODgzMzIxNiwiZXhwIjoyMDk0NDA5MjE2fQ.365288o9pqIuioIZUk4iX1nPYZkCso-tcVJA5NwMJTE'

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

async function rest(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: { ...headers, 'Prefer': 'return=representation,resolution=ignore-duplicates' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

async function adminApi(method, path, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  return res.json()
}

async function main() {
  console.log('=== Seed Users ===\n')

  // 1. Ambil semua auth users
  const { users } = await adminApi('GET', 'users')
  console.log(`Auth users ditemukan: ${users.length}`)
  users.forEach(u => console.log(` - ${u.email} (${u.id})`))

  // 2. Insert semua auth users ke public.users sebagai USER
  for (const u of users) {
    const result = await rest('POST', 'users', {
      supabase_id: u.id,
      email: u.email,
      role: 'USER',
    })
    console.log(`\nInsert public.users [${u.email}]:`, JSON.stringify(result))

    // 3. Insert profile
    // Ambil id dari public.users
    const userRows = await rest('GET', `users?supabase_id=eq.${u.id}&select=id`)
    const userId = Array.isArray(userRows) ? userRows[0]?.id : null
    if (userId) {
      const fullName = u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0]
      const phone = u.user_metadata?.phone || null
      const profileResult = await rest('POST', 'profiles', {
        user_id: userId,
        full_name: fullName,
        phone,
      })
      console.log(`Insert profiles [${u.email}]:`, JSON.stringify(profileResult))
    }
  }

  // 4. Buat akun admin baru jika belum ada
  const adminEmail = 'admin@tdwresources.id'
  const adminExists = users.find(u => u.email === adminEmail)

  if (!adminExists) {
    console.log('\nMembuat akun admin...')
    const newAdmin = await adminApi('POST', 'users', {
      email: adminEmail,
      password: 'Admin@TDW2026',
      email_confirm: true,
      user_metadata: { full_name: 'Admin TDW', role: 'ADMIN' },
    })
    console.log('Admin auth created:', newAdmin.id, newAdmin.email)

    // Insert ke public.users sebagai ADMIN
    const adminUserResult = await rest('POST', 'users', {
      supabase_id: newAdmin.id,
      email: adminEmail,
      role: 'ADMIN',
    })
    console.log('Insert public.users [admin]:', JSON.stringify(adminUserResult))

    // Insert profile admin
    const adminRows = await rest('GET', `users?supabase_id=eq.${newAdmin.id}&select=id`)
    const adminUserId = Array.isArray(adminRows) ? adminRows[0]?.id : null
    if (adminUserId) {
      await rest('POST', 'profiles', { user_id: adminUserId, full_name: 'Admin TDW', city: 'Jakarta', occupation: 'Administrator' })
      console.log('Profile admin created.')
    }
  } else {
    console.log('\nAdmin sudah ada, set role ADMIN...')
    await rest('PATCH', `users?email=eq.${adminEmail}`, { role: 'ADMIN' })
    console.log('Role admin updated.')
  }

  // 5. Tampilkan hasil akhir
  console.log('\n=== Hasil public.users ===')
  const finalUsers = await rest('GET', 'users?select=email,role,created_at')
  console.table(finalUsers)

  console.log('\n✅ Selesai!')
  console.log('Admin  → admin@tdwresources.id / Admin@TDW2026')
  console.log('User   → ahkdancoc@gmail.com (password sama seperti saat daftar)')
}

main().catch(console.error)
