-- ╔══════════════════════════════════════════════════════════╗
-- ║   PONDY PROMOTERS — SUPABASE SETUP (v2)                 ║
-- ║   Supabase → SQL Editor → New Query → Run All           ║
-- ╚══════════════════════════════════════════════════════════╝

create table if not exists properties (
  id             bigserial primary key,
  name           text not null,
  location       text not null,
  price          text not null,
  type           text not null,
  sqft           text,
  beds           integer,
  baths          integer,
  description    text,
  tags           text[] default '{}',
  image_url      text,
  instagram_link text,
  is_featured    boolean default false,
  featured_order integer,
  created_at     timestamptz default now()
);

create table if not exists contact_submissions (
  id           bigserial primary key,
  interest     text, email text, phone text,
  date         text, budget text, message text,
  is_read      boolean default false,
  submitted_at timestamptz default now()
);

alter table properties enable row level security;
create policy "Public read"    on properties for select using (true);
create policy "Anon insert"    on properties for insert with check (true);
create policy "Anon update"    on properties for update using (true);
create policy "Anon delete"    on properties for delete using (true);

alter table contact_submissions enable row level security;
create policy "Anyone submit"  on contact_submissions for insert with check (true);
create policy "Anon read"      on contact_submissions for select using (true);
create policy "Anon update"    on contact_submissions for update using (true);
create policy "Anon delete"    on contact_submissions for delete using (true);

insert into storage.buckets (id, name, public) values ('property-images','property-images',true) on conflict do nothing;
create policy "Public read images"  on storage.objects for select using (bucket_id='property-images');
create policy "Anon upload images"  on storage.objects for insert with check (bucket_id='property-images');
create policy "Anon delete images"  on storage.objects for delete using (bucket_id='property-images');

insert into properties (name, location, price, type, sqft, tags, is_featured, featured_order) values
  ('Beachfront Plot',       'Serenity Beach, Pondicherry', '₹80L – 1.5 Cr', 'Plot',         '1200', '{"NEW LAUNCH"}', true, 1),
  ('Residential Apartment', 'ECR Road, Pondicherry',       '₹45L – 75L',    'Apartment',    '950',  '{"BEST VALUE"}', true, 2),
  ('Luxury Villa',          'Auroville Road, Pondicherry', '₹1.2 – 1.8 Cr', 'Luxury Villa', '2500', '{"TRENDING"}',   true, 3),
  ('ECR Sea View Plot',     'East Coast Road, Pondicherry','₹60L – 90L',    'Plot',         '2000', '{"HOT DEAL"}',   true, 4),
  ('Heritage Bungalow',     'White Town, Pondicherry',     '₹2.5 – 3.5 Cr', 'Bungalow',    '3600', '{"EXCLUSIVE"}',  true, 5);
