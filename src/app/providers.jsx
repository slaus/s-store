"use client";
import { AppProviders } from '@/context/AppContext';

export default function Providers({ children }) {
  return <AppProviders>{children}</AppProviders>;
}