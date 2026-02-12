import { cn } from "@/lib/utils";

type Tab = "ai-games" | "multiplayer" | "ai-only";

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "ai-games", label: "All Games" },
  { id: "multiplayer", label: "Multiplayer" },
  { id: "ai-only", label: "AI Games" },
];

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <nav className="bg-navbar backdrop-blur-md border-b border-border/50 px-6 sticky top-[73px] z-40">
      <div className="flex gap-8 max-w-7xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative py-4 text-sm font-medium transition-all duration-200",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span 
              className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-primary scale-x-100" 
                  : "bg-transparent scale-x-0"
              )} 
            />
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
export type { Tab };
