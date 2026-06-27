export type PlanTier = 'free' | 'silver' | 'gold';

const TIER_RANK: Record<PlanTier, number> = { free: 0, silver: 1, gold: 2 };

export function getPlanTier(planName: string): PlanTier {
  const n = planName.toLowerCase();
  if (n.includes('gold')) return 'gold';
  if (n.includes('silver')) return 'silver';
  return 'free';
}

// Returns true if a subscription item grants access.
// Clerk uses "upcoming" for a newly created subscription and "active" once the period starts.
// Both mean the user has paid and should have access. canceledAt being set means it's
// been scheduled for cancellation (cancel_at_period_end) — treat as no longer active.
function isItemActive(item: any): boolean {
  return (item.status === 'active' || item.status === 'upcoming') && !item.canceledAt;
}

// Returns the highest active tier from a Clerk BillingSubscriptionResource.
export function getActiveUserTier(subscription: unknown): PlanTier {
  const sub = subscription as any;
  if (!sub?.subscriptionItems?.length) return 'free';

  let highest: PlanTier = 'free';
  for (const item of sub.subscriptionItems as any[]) {
    if (isItemActive(item)) {
      const tier = getPlanTier(item.plan.name as string);
      if (TIER_RANK[tier] > TIER_RANK[highest]) highest = tier;
    }
  }
  return highest;
}

// Returns the active paid subscription item (silver or gold), or null if on free.
export function getPaidSubscriptionItem(subscription: unknown): any | null {
  const sub = subscription as any;
  if (!sub?.subscriptionItems) return null;
  return (
    (sub.subscriptionItems as any[]).find(
      (item) => isItemActive(item) && getPlanTier(item.plan.name) !== 'free'
    ) ?? null
  );
}

// Returns true if the user's tier grants access to a language at languageTier.
export function canAccessLanguageTier(languageTier: PlanTier, userTier: PlanTier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[languageTier];
}
