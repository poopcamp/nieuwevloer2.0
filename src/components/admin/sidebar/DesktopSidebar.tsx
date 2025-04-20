
import React from "react";
import { Link } from "react-router-dom";
import { Menu, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { menuGroups, HomeButton, LogoutIcon } from "./SidebarMenuData";

interface DesktopSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: (path: string) => boolean;
  handleLogout: () => Promise<void>;
  openGroups: Record<string, boolean>;
  toggleGroup: (group: string) => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  isOpen,
  onClose,
  isActive,
  handleLogout,
  openGroups,
  toggleGroup
}) => {
  return (
    <TooltipProvider>
      <aside className={cn(
        "h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300",
        isOpen ? "w-64" : "w-[70px]"
      )}>
        <div className={cn(
          "p-4 flex items-center",
          !isOpen ? "justify-center" : "justify-between"
        )}>
          {isOpen ? (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Admin</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">NieuweVloer.be</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <PanelLeft className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                  <Menu className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Expand menu
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        
        <Separator />
        
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-auto scrollbar-thin">
          {isOpen && (
            <Button
              variant="outline"
              className="w-full justify-start text-sm mb-3"
              asChild
            >
              <Link to="/" className="flex items-center">
                <HomeButton />
                Ga naar homepagina
              </Link>
            </Button>
          )}
          
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-3">
              {isOpen ? (
                <Collapsible 
                  open={openGroups[group.title]} 
                  onOpenChange={() => toggleGroup(group.title)}
                  className="space-y-1"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-xs font-medium text-gray-500 dark:text-gray-400 py-1 h-auto"
                    >
                      <span>{group.title}</span>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        openGroups[group.title] && "rotate-90"
                      )} />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {group.items.map((item) => (
                      <Button
                        key={item.href}
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-sm font-medium py-2 h-auto",
                          isActive(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted/50",
                          item.highlight && !isActive(item.href) && "text-primary"
                        )}
                        asChild
                      >
                        <Link to={item.href} className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                          {item.badge && (
                            <Badge variant="outline" className="ml-auto bg-primary/10 text-primary">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                // Compact sidebar view with tooltips
                <div className="space-y-1 py-2">
                  <div className="px-2 pb-1">
                    <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
                  </div>
                  {group.items.map((item) => (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive(item.href) ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-center p-2 h-10",
                            isActive(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                          )}
                          asChild
                        >
                          <Link to={item.href} className="relative">
                            {item.icon}
                            {item.badge && (
                              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-primary text-white">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        
        <div className={cn(
          "p-4 mt-auto border-t border-gray-200 dark:border-gray-800",
          !isOpen && "flex justify-center"
        )}>
          {isOpen ? (
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={handleLogout}
            >
              {LogoutIcon}
              Uitloggen
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleLogout}
                >
                  {LogoutIcon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Uitloggen
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default DesktopSidebar;
