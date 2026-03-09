import { create } from "zustand";
import { FREE_TRIAL_MAX_CHARS, MAX_CHARS_ALLOWED } from "~/config/credits";

interface PlanStore {
  isFreeTrial: boolean | null;
  trialExpired: boolean | null;
  trialExpiresAt: string | null;
  maxCharsAllowed: number;
  isTrialTier: boolean | null;
  setPlan: (plan: {
    isFreeTrial: boolean;
    trialExpired: boolean;
    trialExpiresAt: string | null;
  }) => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  isFreeTrial: null,
  trialExpired: null,
  trialExpiresAt: null,
  maxCharsAllowed: MAX_CHARS_ALLOWED,
  isTrialTier: null,
  setPlan: ({ isFreeTrial, trialExpired, trialExpiresAt }) => {
    const isTrialTier = trialExpiresAt !== null;

    set({
      isFreeTrial,
      trialExpired,
      trialExpiresAt,
      isTrialTier,
      maxCharsAllowed: isTrialTier ? FREE_TRIAL_MAX_CHARS : MAX_CHARS_ALLOWED,
    });
  },
}));
