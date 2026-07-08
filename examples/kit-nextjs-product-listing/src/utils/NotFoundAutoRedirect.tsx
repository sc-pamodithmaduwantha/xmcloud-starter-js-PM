'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NotFoundAutoRedirectProps {
  /** Delay before redirecting, in milliseconds. Defaults to 3000 (3 seconds). */
  delayMs?: number;
  /** Fallback path when there is no previous page to go back to. Defaults to '/'. */
  fallbackHref?: string;
}

/**
 * Client-side helper for the 404 page: after a short delay it sends the user
 * back to the page they came from (browser history). If there is no in-app
 * history to go back to (e.g. direct navigation), it navigates to a fallback
 * path instead. Renders a small countdown notice.
 */
export function NotFoundAutoRedirect({
  delayMs = 3000,
  fallbackHref = '/',
}: NotFoundAutoRedirectProps) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(delayMs / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timeout = setTimeout(() => {
      // Prefer going back to the previous page; fall back when no history exists.
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push(fallbackHref);
      }
    }, delayMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router, delayMs, fallbackHref]);

  return (
    <p role="status" aria-live="polite">
      Redirecting you back in {secondsLeft} second{secondsLeft === 1 ? '' : 's'}...
    </p>
  );
}
