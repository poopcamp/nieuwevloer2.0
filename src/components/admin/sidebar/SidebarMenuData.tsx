
import {
  Home,
  Settings,
  Users,
  FileText,
  Calendar,
  Image,
  Inbox,
  Calculator,
  BookOpen,
  Building,
  Grid3X3,
  LogOut,
  Landmark,
  Layout,
  CalculatorIcon,
  Clock,
} from "lucide-react";

// Define the MenuGroup and MenuItem types
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
  <Home className="mr-2 h-5 w-5"/>
);

export const LogoutIcon = (
  <LogOut className="mr-2 h-5 w-5" />
);

export const menuGroups: MenuGroup[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "Leads",
        href: "/admin/leads",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Afspraken",
        href: "/admin/calendar",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: "Berichten",
        href: "/admin/messages",
        icon: <Inbox className="h-5 w-5" />,
      }
    ]
  },
  {
    title: "Calculators",
    items: [
      {
        title: "Snelle Prijsindicatie",
        href: "/admin/quick-calculator",
        icon: <Calculator className="h-5 w-5" />,
      },
      {
        title: "Uitgebreide Calculator",
        href: "/admin/extended-calculator",
        icon: <CalculatorIcon className="h-5 w-5" />,
      }
    ]
  },
  {
    title: "Content",
    items: [
      {
        title: "Homepage",
        href: "/admin/home",
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
        title: "Projecten",
        href: "/admin/projects",
        icon: <Building className="h-5 w-5" />,
      }
    ]
  },
  {
    title: "Configuratie",
    items: [
      {
        title: "Configurator Builder",
        href: "/admin/configurator-builder",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: "Project Types",
        href: "/admin/project-types",
        icon: <Landmark className="h-5 w-5" />,
      },
      {
        title: "Media Bestanden",
        href: "/admin/media",
        icon: <Image className="h-5 w-5" />,
      },
      {
        title: "Instellingen",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
      }
    ]
  }
];
