import { Gamepad2 } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-background border-b px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Gamepad2 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Game Hub 🎮
          </span>
        </div>

        {/* Right: Tagline */}
        <p className="text-sm text-muted-foreground hidden md:block">
          Interactive AI Game Environments
        </p>

      </div>
    </header>
  );
};

export default Navbar;
