import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="w-full bg-transparent backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <HashLink smooth to="/#home" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <span className="text-xl font-bold text-gray-900">Livin Significant</span>
        </HashLink>

        <nav className="hidden md:flex items-center space-x-8">
          <HashLink smooth to="/#home" className="text-gray-700 hover:text-primary-500 font-medium">
            Home
          </HashLink>
          <HashLink
            smooth
            to="/#features"
            className="text-gray-700 hover:text-primary-500 font-medium"
          >
            Features
          </HashLink>
          <HashLink
            smooth
            to="/#testimonials"
            className="text-gray-700 hover:text-primary-500 font-medium"
          >
            Testimonials
          </HashLink>
          <Link to="/login">
            <Button className="bg-primary-500 text-white hover:bg-primary-600">
              UserLogin
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white  shadow-md py-4 px-4 absolute w-full z-50 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium">
              Home
            </Link>
            <HashLink
              smooth
              to="/#features"
              className="text-gray-700 hover:text-primary-500 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </HashLink>
            <HashLink


              smooth
              to="/#testimonials"
              className="text-gray-700 hover:text-primary-500 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </HashLink>
            <Link
              to="/login"
              className="inline-block w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button
                variant="outline"
                className="border-primary-500 text-primary-500 hover:bg-primary-50 w-full"
              >
                Sign In
              </Button>
            </Link>
            <Link
              to="/login"
              className="inline-block w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="bg-primary-500 text-white hover:bg-primary-600 w-full">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;