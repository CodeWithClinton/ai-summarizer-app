import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-semibold text-foreground">
            Curated
          </span>
        </Link>
      </div>
    </header>
  );
}
