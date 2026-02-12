import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GameCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  variant: "ai" | "multiplayer";
  onPlay: (gameId: string) => void;
}

const GameCard = ({ id, title, subtitle, icon, variant, onPlay }: GameCardProps) => {
  const isAI = variant === "ai";

  const handlePlay = () => {
    // TODO: Backend integration
    // - Some games will open in a new page/tab
    // - Some games will load inside the same page
    // - Ask for clarification before implementing backend routing
    console.log(`Playing game: ${title} (ID: ${id})`);
    onPlay(id);
  };

  return (
    <div 
      className={cn(
        "glass-card rounded-2xl p-6 shadow-card",
        "transition-all duration-200 ease-out",
        "hover:shadow-card-hover hover:-translate-y-1",
        "group"
      )}
    >
      {/* Icon Badge with Gradient and Glow */}
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-5",
          "transition-all duration-200 ease-out",
          isAI 
            ? "icon-bg-blue-gradient group-hover:icon-glow-blue" 
            : "icon-bg-orange-gradient group-hover:icon-glow-orange"
        )}
      >
        <div className={cn(
          "transition-all duration-200",
          isAI ? "text-primary" : "text-accent"
        )}>
          {icon}
        </div>
      </div>

      {/* Title & Subtitle */}
      <h3 className="font-semibold text-foreground uppercase tracking-wide text-sm mb-1">
        {title}
      </h3>
      <p className="text-muted-foreground text-xs mb-5">{subtitle}</p>

      {/* Play Button with Gradient and Glow */}
      <button
        onClick={handlePlay}
        className={cn(
          "w-full py-3 px-4 rounded-full font-semibold text-sm",
          "flex items-center justify-center gap-2",
          "transition-all duration-200 ease-out",
          "group/btn",
          isAI
            ? "bg-gradient-to-b from-primary-light to-primary text-primary-foreground hover:btn-glow-blue hover:scale-[1.02]"
            : "bg-gradient-to-b from-accent-light to-accent text-accent-foreground hover:btn-glow-orange hover:scale-[1.02]"
        )}
      >
        <Play className="w-4 h-4 fill-current transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        Play
      </button>
    </div>
  );
};

export default GameCard;
