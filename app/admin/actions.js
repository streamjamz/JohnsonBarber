'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireUser } from '@/lib/admin-auth';

function db() {
  const client = createAdminClient();
  if (!client) throw new Error('Supabase is not configured.');
  return client;
}

// Revalidate the public pages affected by content edits.
function refresh(extra = []) {
  ['/', '/services', '/gallery', '/faq', '/kit', '/book'].concat(extra).forEach((p) => {
    try { revalidatePath(p); } catch (e) {}
  });
}

const num = (v, d = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};
const str = (v) => (v == null ? null : String(v).trim() || null);

/* ---------------- BARBERS ---------------- */
export async function upsertBarber(formData) {
  await requireUser();
  const id = str(formData.get('id'));
  const row = {
    name: str(formData.get('name')),
    first_name: str(formData.get('first_name')),
    role: str(formData.get('role')),
    specialty: str(formData.get('specialty')),
    initial: str(formData.get('initial')),
    photo_url: str(formData.get('photo_url')),
    email: str(formData.get('email')),
    phone: str(formData.get('phone')),
    active: formData.get('active') === 'on',
    sort_order: num(formData.get('sort_order'), 0),
  };
  if (!row.name) throw new Error('Name is required.');
  const supabase = db();
  if (id) await supabase.from('barbers').update(row).eq('id', id);
  else await supabase.from('barbers').insert(row);
  refresh(['/admin/barbers']);
}

export async function deleteBarber(formData) {
  await requireUser();
  const id = str(formData.get('id'));
  if (!id) return;
  await db().from('barbers').delete().eq('id', id);
  refresh(['/admin/barbers']);
}

/* ---------------- SERVICES ---------------- */
export async function upsertService(formData) {
  await requireUser();
  const id = str(formData.get('id'));
  const row = {
    name: str(formData.get('name')),
    price: num(formData.get('price'), 0),
    duration: str(formData.get('duration')),
    description: str(formData.get('description')),
    active: formData.get('active') === 'on',
    sort_order: num(formData.get('sort_order'), 0),
  };
  if (!row.name) throw new Error('Name is required.');
  const supabase = db();
  if (id) await supabase.from('services').update(row).eq('id', id);
  else await supabase.from('services').insert(row);
  refresh(['/admin/services']);
}

export async function deleteService(formData) {
  await requireUser();
  const id = str(formData.get('id'));
  if (!id) return;
  await db().from('services').delete().eq('id', id);
  refresh(['/admin/services']);
}

/* ---------------- ADD-ONS ---------------- */
export async function upsertAddon(formData) {
  await requireUser();
  const id = str(formData.get('id'));
  const row = {
    name: str(formData.get('name')),
    price: num(formData.get('price'), 0),
    description: str(formData.get('description')),
    active: formData.get('active') === 'on',
    sort_order: num(formData.get('sort_order'), 0),
  };
  if (!row.name) throw new Error('Name is required.');
  const supabase = db();
  if (id) await supabase.from('addons').update(row).eq('id', id);
  else await supabase.from('addons').insert(row);
  refresh(['/admin/services']);
}

export async function deleteAddon(formData) {
  await requireUser();
  const id = str(formData.get('id'));
  if (!id) return;
  await db().from('addons').delete().eq('id', id);
  refresh(['/admin/services']);
}

/* ---------------- HOURS ---------------- */
export async function saveHours(formData) {
  await requireUser();
  const ids = formData.getAll('hid');
  const supabase = db();
  for (const id of ids) {
    await supabase.from('hours').update({
      day: str(formData.get(`day_${id}`)),
      time: str(formData.get(`time_${id}`)),
      closed: formData.get(`closed_${id}`) === 'on',
    }).eq('id', id);
  }
  refresh();
}

/* ---------------- CONTENT (key/value) ---------------- */
export async function saveContent(formData) {
  await requireUser();
  const keys = formData.getAll('ckey');
  const supabase = db();
  const rows = keys.map((k) => ({ key: k, value: str(formData.get(`cval_${k}`)) ?? '' }));
  if (rows.length) await supabase.from('content').upsert(rows);
  refresh();
}

/* ---------------- APPOINTMENTS ---------------- */
export async function cancelAppointment(formData) {
  await requireUser();
  const id = str(formData.get('id'));
  if (!id) return;
  await db().from('appointments').update({ status: 'cancelled' }).eq('id', id);
  refresh(['/admin']);
}
