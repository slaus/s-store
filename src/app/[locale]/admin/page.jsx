import { redirect } from 'next/navigation';

export default async function AdminIndex({ params, searchParams }) {
  const { locale } = await params;
  const token = (await searchParams)?.token || '';
  const query = token ? `?token=${token}` : '';
  redirect(`/${locale}/admin/products${query}`);
}