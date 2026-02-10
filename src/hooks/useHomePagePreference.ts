import { useState, useEffect } from 'react';

export type HomePageOption = 
  | '/app'
  | '/app/todo'
  | '/app/notebook'
  | '/app/recap'
  | '/app/settings';

export interface HomePageConfig {
  value: HomePageOption;
  label: string;
}

export const homePageOptions: HomePageConfig[] = [
  { value: '/app', label: 'Calendar' },
  { value: '/app/todo', label: 'To-Do' },
  { value: '/app/notebook', label: 'Notebook' },
  { value: '/app/recap', label: 'Weekly Recap' },
  { value: '/app/settings', label: 'Settings' },
];

const STORAGE_KEY = 'focus-home-page';

export function useHomePagePreference() {
  const [homePage, setHomePageState] = useState<HomePageOption>('/app');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && homePageOptions.some(opt => opt.value === stored)) {
      setHomePageState(stored as HomePageOption);
    }
  }, []);

  const setHomePage = (page: HomePageOption) => {
    setHomePageState(page);
    localStorage.setItem(STORAGE_KEY, page);
  };

  return {
    homePage,
    setHomePage,
    homePageOptions,
  };
}
