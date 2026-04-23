'use client';

import { useState, useEffect, useRef } from 'react';
import { authService } from '@/services/auth.service';

interface UserInfo {
  name: string;
  email: string;
}

// Global in-memory cache shared across all hook instances
const userCache = new Map<string, UserInfo>();
const pendingRequests = new Map<string, Promise<void>>();

/**
 * Hook that resolves an array of user IDs into user names/emails.
 * Uses a shared in-memory cache to avoid redundant API calls.
 */
export function useUserNames(userIds: string[]): Map<string, UserInfo> {
  const [names, setNames] = useState<Map<string, UserInfo>>(new Map());
  const prevIdsRef = useRef<string>('');

  useEffect(() => {
    // Deduplicate and filter out empty/undefined IDs
    const uniqueIds = [...new Set(userIds.filter((id) => id && id.length > 0))];
    const idsKey = uniqueIds.sort().join(',');

    // Skip if IDs haven't changed
    if (idsKey === prevIdsRef.current && names.size > 0) return;
    prevIdsRef.current = idsKey;

    if (uniqueIds.length === 0) return;

    // Check which IDs we already have cached
    const cached = new Map<string, UserInfo>();
    const uncachedIds: string[] = [];

    for (const id of uniqueIds) {
      const existing = userCache.get(id);
      if (existing) {
        cached.set(id, existing);
      } else {
        uncachedIds.push(id);
      }
    }

    // If all cached, just set state
    if (uncachedIds.length === 0) {
      setNames(cached);
      return;
    }

    // Fetch uncached IDs
    const fetchUsers = async () => {
      try {
        const users = await authService.getUsersBatch(uncachedIds);
        for (const user of users) {
          const info: UserInfo = { name: user.name, email: user.email };
          userCache.set(user.id, info);
          cached.set(user.id, info);
        }
      } catch {
        // Silently fail — will show fallback IDs
        for (const id of uncachedIds) {
          const fallback: UserInfo = { name: id.slice(0, 8) + '...', email: '' };
          cached.set(id, fallback);
        }
      }
      setNames(new Map(cached));
    };

    fetchUsers();
  }, [userIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return names;
}

/**
 * Helper to get a display name from the resolved map, falling back to truncated ID.
 */
export function getDisplayName(
  namesMap: Map<string, { name: string; email: string }>,
  userId: string,
  prefix?: string
): string {
  const info = namesMap.get(userId);
  if (info && info.name && !info.name.endsWith('...')) {
    return prefix ? `${prefix} ${info.name}` : info.name;
  }
  return prefix ? `${prefix} ${userId.slice(0, 8)}...` : `${userId.slice(0, 8)}...`;
}

/**
 * Helper to get initials from a display name.
 */
export function getInitials(
  namesMap: Map<string, { name: string; email: string }>,
  userId: string
): string {
  const info = namesMap.get(userId);
  if (info && info.name && !info.name.endsWith('...')) {
    return info.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return userId.slice(0, 2).toUpperCase();
}
