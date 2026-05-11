'use client';

import { useContracts } from './useContracts';

export function useRole() {
  const { role, loading } = useContracts();
  return { role, loading };
}
