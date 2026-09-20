
import { Menu, Bell, User, Home, Settings, Sun, Moon } from 'lucide-react';
import BrandScopeTabs from '@/components/admin/BrandScopeTabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface AdminHeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  userEmail: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  toggleSidebar, 
  sidebarOpen, 
  userEmail 
}) => {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const [notificationCount] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Theme toggle effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };
  
  const handleProfileClick = () => {
    navigate('/admin/settings');
  };

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : 'U';
  
  return (
    <TooltipProvider>
      <header className="z-10 border-b border-white/10 bg-slate-900 text-white shadow-sm">
        <div className="flex items-center justify-between px-3 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white focus:outline-none"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Sluit sidebar" : "Open sidebar"}
            >
              <Menu size={22} />
            </Button>
            <h1 className="hidden text-lg font-semibold sm:block md:text-xl">Beheer</h1>
          </div>
          
          <div className="mx-2 hidden md:block">
            <BrandScopeTabs />
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Home button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hidden text-slate-300 hover:text-white focus:outline-none sm:flex" 
                  asChild
                >
                  <Link to="/">
                    <Home size={20} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Naar homepagina</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Theme toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme} 
                  className="text-slate-300 hover:text-white focus:outline-none"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{theme === 'light' ? 'Donkere modus' : 'Lichte modus'}</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-slate-300 hover:text-white focus:outline-none"
                  >
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center p-0 text-[10px]">
                        {notificationCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{notificationCount} ongelezen notificaties</p>
              </TooltipContent>
            </Tooltip>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center focus:outline-none p-1 sm:pl-2 sm:pr-3 gap-2"
                  aria-label="Gebruikersmenu"
                >
                  <div className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
                    {userInitial}
                  </div>
                  <span className="ml-1 text-sm font-medium hidden sm:block truncate max-w-[120px]">
                    {userEmail}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">Administrator</p>
                    <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profiel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Instellingen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <div className="flex items-center text-destructive">
                    Uitloggen
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};

export default AdminHeader;
