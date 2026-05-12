'use client';

export interface UserProfile {
  displayName: string;
  email: string;
  approvalThreshold: string;
  network: string;
}

const PROFILE_KEY = 'vestly_profiles_v1';

const DEFAULT_PROFILE: UserProfile = {
  displayName: '',
  email: '',
  approvalThreshold: '1 of 1 (single approver)',
  network: 'Solana Devnet',
};

function readProfiles(): Record<string, UserProfile> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, UserProfile>) : {};
  } catch {
    return {};
  }
}

function writeProfiles(profiles: Record<string, UserProfile>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
}

export function getProfile(wallet: string | null): UserProfile {
  if (!wallet) return DEFAULT_PROFILE;
  return { ...DEFAULT_PROFILE, ...readProfiles()[wallet] };
}

export function saveProfile(wallet: string, profile: UserProfile) {
  const profiles = readProfiles();
  profiles[wallet] = profile;
  writeProfiles(profiles);
}
