export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
};

export type NavigationState = {
  isOpen: boolean;
  activeItem: string | null;
};


