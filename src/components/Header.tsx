import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export const Header = () => {
  return <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            
            <div>
              <h1 className="text-left font-serif text-3xl text-[#480000] font-bold">Bible Kaloltsavam Results </h1>
              <p className="text-[#480000] font-serif font-medium text-lg">Official Results from Catechism Diocese of Mandya </p>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              
            </Button>
            <Button variant="default" asChild>
              <Link to="/admin" className="font-serif text-white">Admin Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>;
};