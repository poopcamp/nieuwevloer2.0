
export interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  highlight?: boolean;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}
