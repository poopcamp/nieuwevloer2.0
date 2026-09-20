
import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight, Home } from "lucide-react";
import { menuGroups, HomeButton, LogoutIcon } from "./SidebarMenuData";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: (path: string) => boolean;
  handleLogout: () => Promise<void>;
  openGroups: Record<string, boolean>;
  toggleGroup: (group: string) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  isActive,
  handleLogout,
  openGroups,
  toggleGroup
}) => {
  return (
    <TooltipProvider>
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} aria-hidden="true" />
        )}
        
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-100 border-r border-white/10 transition-transform duration-300 ease-in-out transform",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Beheer</h2>
              <p className="text-sm text-slate-400">NieuweVloer · NieuwTerras</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <Separator />
          
          <nav className="flex-1 p-3 space-y-1 overflow-auto max-h-[calc(100vh-140px)]">
            <Button
              variant="default" 
              className="w-full justify-start text-sm mb-3 bg-primary-600 hover:bg-primary-700"
              asChild
            >
              <Link to="/" className="flex items-center" onClick={onClose}>
                <Home className="mr-2 h-5 w-5" />
                Bekijk website
              </Link>
            </Button>
            
            {menuGroups.map((group) => (
              <div key={group.title} className="mb-2">
                <Collapsible 
                  open={openGroups[group.title]} 
                  onOpenChange={() => toggleGroup(group.title)}
                  className="space-y-1"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-xs font-medium text-slate-400 py-1 h-auto hover:text-white"
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
                          "w-full justify-start text-sm font-medium py-2 h-auto px-3",
                          isActive(item.href) ? "bg-teal-700 text-white" : "text-slate-200 hover:bg-white/10",
                          item.highlight && !isActive(item.href) && "text-teal-300"
                        )}
                        asChild
                        onClick={onClose}
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
              </div>
            ))}
          </nav>
          
          <div className="mt-auto border-t border-white/10 p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-sm"
              onClick={handleLogout}
            >
              {LogoutIcon}
              Uitloggen
            </Button>
          </div>
        </aside>
      </>
    </TooltipProvider>
  );
};

export default MobileSidebar;
