// src/pages/Blogs.tsx
import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Calendar, User } from "lucide-react";
import { HashLink } from "react-router-hash-link";
import "../App.css"

const blogs = [
  {
    id: 1,
    title: "The Truth About Carbs",
    snippet: "Are carbs your enemy? Let’s dive into the science of carbohydrates and how they affect your body...",
    author: "Dr. Jane Foster",
    date: "May 20, 2025",
  },
  {
    id: 2,
    title: "Why Hydration Is Critical",
    snippet: "You’ve heard it before—drink more water. But how much is enough and why does it matter so much?",
    author: "Mark Stone",
    date: "May 15, 2025",
  },
  // Add more blogs here
];

const Blogs = () => {
  return (
    <div id="blogs" className="min-h-screen flex flex-col">
      <NavBar />
       <a
          href="https://wa.me/919398036704?text=Hello%20I%20am%20from%20livinsignificant%20site%20can%20we%20please%20talk%20about%20the%20process%20"
          className="whatsapp-float"
          target="_blank"
        >
          <img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png" alt="WhatsApp Chat" />
        </a>

      <section className="pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Nutrition Insights & Articles</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated blogs by professionals to help you make informed health decisions.
          </p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container mx-auto px-4 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <HashLink to={`/blogs/${blog.id}`} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{blog.snippet}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" /> {blog.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {blog.date}
                </span>
              </div>
            </HashLink>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blogs;
