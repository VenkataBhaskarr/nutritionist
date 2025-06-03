import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Button } from "@/components/ui/button";
import { Menu, Home, Star, Book, Calculator, LogIn, ArrowRight } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-transparent backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <HashLink smooth to="/#home" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <span className="font-bold">
              <img src="logo.png" alt="Livin Significant Logo" />
            </span>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">Livin Significant</span>
        </HashLink>

        <nav className="hidden md:flex items-center space-x-8">
          <HashLink smooth to="/#home" className="text-gray-700 hover:text-primary-500 font-medium">
             Home
          </HashLink>
          <HashLink
            smooth
            to="/#package"
            className="text-gray-700 hover:text-primary-500 font-medium"
          >
             Pricing
          </HashLink>
          <HashLink
            smooth
            to="/#services"
            className="text-gray-700 hover:text-primary-500 font-medium"
          >
            Services
          </HashLink>
          <HashLink
            smooth
            to="/#testimonials"
            className="text-gray-700 hover:text-primary-500 font-medium"
          >
             Testimonials
          </HashLink>
          <HashLink
            smooth
            to="/#our-team"
            className="text-gray-700 hover:text-primary-500 font-medium"
          >
             Our Team
          </HashLink>
          <HashLink
            smooth
            to="/blogs"
            className="text-gray-700 hover:text-primary-500 font-medium"
          >
            Blogs
          </HashLink>
          <HashLink
            smooth
            to="/calculator"
            className="text-gray-700 hover:text-primary-500 font-medium"
          >
             Calculator
          </HashLink>
          
          <Link to="/login">
            <Button className="bg-primary-500 text-white hover:bg-primary-600">
              <LogIn className="inline-block w-5 h-5 mr-1" /> UserLogin
            </Button>
          </Link>
        </nav>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <ArrowRight className={`w-6 h-6 transform ${isMenuOpen ? 'rotate-90' : 'rotate-0'} transition-transform`} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-4 absolute w-full z-50 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <HashLink
              smooth
              to="/#home"
              className="text-gray-700 hover:text-primary-500 font-medium flex items-center"
              onClick={handleLinkClick}
            >
               Home
            </HashLink>
            <HashLink
              smooth
              to="/#services"
              className="text-gray-700 hover:text-primary-500 font-medium flex items-center"
              onClick={handleLinkClick}
            >
              Services
            </HashLink>
            <HashLink
              smooth
              to="/blogs"
              className="text-gray-700 hover:text-primary-500 font-medium flex items-center"
              onClick={handleLinkClick}
            >
               Blogs
            </HashLink>
            <HashLink
              smooth
              to="/calculator"
              className="text-gray-700 hover:text-primary-500 font-medium flex items-center"
              onClick={handleLinkClick}
            >
               Calculator
            </HashLink>
            <HashLink
              smooth
              to="/#testimonials"
              className="text-gray-700 hover:text-primary-500 font-medium flex items-center"
              onClick={handleLinkClick}
            >
               Testimonials
            </HashLink>
            <HashLink
              smooth
              to="/#our-team"
              className="text-gray-700 hover:text-primary-500 font-medium flex items-center"
              onClick={handleLinkClick}
            >
              Team
            </HashLink>
            <Link
              to="/login"
              className="inline-block w-full"
              onClick={handleLinkClick}
            >
              <Button
                variant="outline"
                className="border-primary-500 text-primary-500 hover:bg-primary-50 w-full flex justify-center"
              >
                <LogIn className="w-6 h-6" /> Login
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;