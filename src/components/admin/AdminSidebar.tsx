
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MobileSidebar from './sidebar/MobileSidebar';
import DesktopSidebar from './sidebar/DesktopSidebar';
import { useAuthActions } from '@/hooks/useAuthActions';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { signOut } = useAuthActions();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Dashboard': true,
    'Content': true,
    'Marketing': false,
    'Configurator': false,
    'Calculators': false,
    'Systeembeheer': false
  });
  
  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return path !== '/admin' && location.pathname.startsWith(path);
  };
  
  const handleLogout = async () => {
    await signOut();
  };
  
  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };
  
  // Automatically open the group for the active page
  useEffect(() => {
    const currentGroup = Object.entries(openGroups).find(([groupName, isOpen]) => {
      // Check if current path is part of this group
      // This is a simplified check - you may need more complex logic based on your menu structure
      const groupMatches = location.pathname.includes(groupName.toLowerCase());
      return groupMatches;
    });
    
    if (currentGroup && !currentGroup[1]) {
      setOpenGroups(prev => ({
        ...prev,
        [currentGroup[0]]: true
      }));
    }
  }, [location.pathname]);
  
  return (
    <>
      <MobileSidebar 
        isOpen={isOpen}
        onClose={onClose} 
        isActive={isActive}
        handleLogout={handleLogout}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
      />
      
      <DesktopSidebar 
        isOpen={isOpen}
        onClose={onClose}
        isActive={isActive}
        handleLogout={handleLogout}
        openGroups={openGroups}
        toggleGroup={toggleGroup}
      />
    </>
  );
};

export default AdminSidebar;
