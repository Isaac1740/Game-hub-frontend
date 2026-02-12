import { ReactNode } from "react";

interface GameSectionProps {
  title: string;
  children: ReactNode;
}

const GameSection = ({ title, children }: GameSectionProps) => {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>
        <div className="mt-2 h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {children}
      </div>
    </section>
  );
};

export default GameSection;
