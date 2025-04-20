
import React from "react";
import * as LucideIcons from "lucide-react";

interface IconMap {
  [key: string]: React.ComponentType<{ className?: string }>;
}

// Create a map of all Lucide icons, filtering out non-component exports
const lucideIconMap: IconMap = Object.entries(LucideIcons)
  .filter(([_, value]) => typeof value === 'function' && 'displayName' in value)
  .reduce((acc, [key, value]) => {
    acc[key] = value as React.ComponentType<{ className?: string }>;
    return acc;
  }, {} as IconMap);

export function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> | null {
  // Check if it's a simple emoji
  if (iconName.length === 1 || (iconName.length === 2 && /\p{Emoji}/u.test(iconName))) {
    // Return a simple component that renders the emoji
    return ({ className }) => (
      <span className={className} style={{ fontSize: "inherit", lineHeight: 1 }}>
        {iconName}
      </span>
    );
  }

  // First character to uppercase to match Lucide component names
  const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  
  // Try to find the icon in Lucide
  if (lucideIconMap[formattedIconName]) {
    return lucideIconMap[formattedIconName];
  }
  
  // Return a fallback icon if not found
  return lucideIconMap.HelpCircle || null;
}
