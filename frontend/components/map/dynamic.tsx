"use client";

import dynamic from "next/dynamic";

export const CommunityMapDynamic = dynamic(() => import("./community-map"), {
  ssr: false,
  loading: () => <div className="flex h-[480px] items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500">Loading map…</div>,
});

export const FarmMapDynamic = dynamic(() => import("./farm-map"), {
  ssr: false,
  loading: () => <div className="flex h-[320px] items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500">Loading map…</div>,
});

export const DistrictMapDynamic = dynamic(() => import("./district-map"), {
  ssr: false,
  loading: () => <div className="flex h-[480px] items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400 dark:bg-slate-800 dark:text-slate-500">Loading map…</div>,
});
