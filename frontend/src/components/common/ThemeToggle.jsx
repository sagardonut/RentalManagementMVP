import React from 'react';
import useTheme from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
      title="Toggle Theme"
    >
      <span className="material-symbols-outlined text-[24px]">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
