import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Layout = {
  theme: 'black'; // Only allow 'black' theme if that's what you want
  drawerOpen: boolean;
};

const initialState: Layout = {
  theme: 'black', // Always use black theme
  drawerOpen: false,
};

export const layoutStore = create<Layout>()(
  persist(() => initialState, {
    name: 'layoutStore',
    partialize: (state) => ({ drawerOpen: state.drawerOpen }),
  }),
);

export default function useLayoutService() {
  const { theme, drawerOpen } = layoutStore();

  // This now only toggles the drawer
  const toggleDrawer = () => {
    layoutStore.setState({ drawerOpen: !drawerOpen });
  };

  // Initialize theme - runs only once
  const initTheme = () => {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;
    // Always set to black theme
    if (!html.hasAttribute('data-theme')) {
      html.setAttribute('data-theme', 'black');
      html.classList.add('dark');
    }
  };

  return {
    theme,
    drawerOpen,
    toggleDrawer,
    initTheme,
  };
}
