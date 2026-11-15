// src/utils/style.js

// --- TRANSITIONS (Hiệu ứng mượt) ---
export const TRANSITION = 'transition-colors duration-300 ease-in-out';

// --- TYPOGRAPHY (Cỡ chữ & Màu chữ) ---
export const TEXT_TITLE = `text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 ${TRANSITION}`;
export const TEXT_SUBTITLE = `text-base font-semibold text-slate-900 dark:text-slate-100 ${TRANSITION}`;
export const TEXT_BODY = `text-base text-slate-600 dark:text-slate-300 ${TRANSITION}`;
export const TEXT_MUTED = `text-sm text-slate-500 dark:text-slate-400 ${TRANSITION}`;
export const TEXT_EYEBROW = `text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400 ${TRANSITION}`;

// --- LAYOUT & BACKGROUNDS (Bố cục & Nền) ---
export const BG_PAGE = `min-h-screen bg-slate-50 dark:bg-slate-950 ${TRANSITION}`;
export const BG_HEADER = `sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg dark:border-slate-800/70 dark:bg-slate-950/85 ${TRANSITION}`;
export const BG_FOOTER = `border-t border-slate-200/70 bg-white/60 py-6 text-center text-sm text-slate-500 dark:border-slate-800/70 dark:bg-slate-950/60 dark:text-slate-400 ${TRANSITION}`;

// --- CARDS (Thẻ hiển thị) ---
export const CARD_BASE = `rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm dark:bg-slate-900 dark:ring-slate-800 ${TRANSITION}`;
export const CARD_HOVER = `hover:-translate-y-0.5 hover:shadow-md dark:hover:ring-slate-700`;

// --- FORM CONTROLS (Nút, Input, Select) ---
export const INPUT_BASE = `rounded-xl border-0 bg-slate-50 px-3 py-2.5 text-base text-slate-900 ring-1 ring-inset ring-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700 dark:focus:bg-slate-800 ${TRANSITION}`;
export const BTN_ICON = `grid h-10 w-10 place-items-center rounded-xl text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800 ${TRANSITION}`;

// --- TABLES (Bảng dữ liệu) ---
export const TABLE_HEAD = `bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 ${TRANSITION}`;
export const TABLE_TH = `whitespace-nowrap px-3 py-3 font-medium ${TRANSITION}`;
export const TABLE_ROW = `border-t border-slate-100 hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40 ${TRANSITION}`;
export const TABLE_TD = `px-3 py-2.5 ${TRANSITION}`;