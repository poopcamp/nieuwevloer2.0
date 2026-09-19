
import {
  Home,
  Settings,
  Users,
  FileText,
  Calendar,
  Image,
  Calculator,
  BookOpen,
  Grid3X3,
  LogOut,
  Layout,
  Search,
} from "lucide-react";

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

export const HomeButton = () => (
  <Home className="mr-2 h-5 w-5" />
);

export const LogoutIcon = (
  <LogOut className="mr-2 h-5 w-5" />
);

export const menuGroups: MenuGroup[] = [
  {
    title: "Overzicht",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "Leads & offertes",
        href: "/admin/leads",
        icon: <Users className="h-5 w-5" />,
        highlight: true,
      },
      {
        title: "Afspraken",
        href: "/admin/calendar",
        icon: <Calendar className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Calculators",
    items: [
      {
        title: "Snelle prijsindicatie",
        href: "/admin/quick-calculator",
        icon: <Calculator className="h-5 w-5" />,
      },
      {
        title: "Uitgebreide calculator",
        href: "/admin/extended-calculator",
        icon: <Calculator className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Homepage",
        href: "/admin/content",
        icon: <Layout className="h-5 w-5" />,
      },
      {
        title: "Tegels",
        href: "/admin/tiles",
        icon: <Grid3X3 className="h-5 w-5" />,
      },
      {
        title: "Blog",
        href: "/admin/blog",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: "Inspiratie",
        href: "/admin/inspiration",
        icon: <Image className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Systeem",
    items: [
      {
        title: "Configurator",
        href: "/admin/configurator-builder",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: "SEO",
        href: "/admin/seo",
        icon: <Search className="h-5 w-5" />,
      },
      {
        title: "Media",
        href: "/admin/media",
        icon: <Image className="h-5 w-5" />,
      },
      {
        title: "Instellingen",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];
