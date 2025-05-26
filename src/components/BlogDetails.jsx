// src/pages/BlogDetails.tsx
import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";


const BlogDetails = () => {
  const blogData = {
  "1": {
    title: "Benefits of Eating Clean",
    content: "Clean eating improves energy, digestion, and mental clarity...",
  },
  "2": {
    title: "Superfoods for Daily Nutrition",
    content: "Incorporate chia seeds, kale, and salmon into your daily meals...",
  },
  "3": {
    title: "Hydration and Health",
    content: "Drinking enough water daily improves metabolism and skin health...",
  },
   "4": {
    title: "Benefits of Eating Clean",
    content: "Clean eating improves energy, digestion, and mental clarity...",
  },
  "5": {
    title: "Superfoods for Daily Nutrition",
    content: "Incorporate chia seeds, kale, and salmon into your daily meals...",
  },
  "6": {
    title: "Hydration and Health",
    content: "Drinking enough water daily improves metabolism and skin health...",
  },
};
  const { id } = useParams();
  const blog = id ? blogData[id] : null;

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-3xl font-bold text-red-600">404 - Blog Not Found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container mx-auto py-20 max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
        <p className="text-lg text-gray-700 leading-8 whitespace-pre-line">{blog.content}</p>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetails;
