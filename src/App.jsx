import React from "react";
import { Routes, Route } from "react-router-dom";

// Import Pages
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Community from "./pages/Community";
import GenerateImages from "./pages/GenerateImages";
import RemoveBackground from "./pages/RemoveBackground";
import RemoveObject from "./pages/RemoveObject";
import ReviewResume from "./pages/ReviewResume";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="community" element={<Community />} />
          <Route path="generate-images" element={<GenerateImages />} />
          <Route path="remove-bg" element={<RemoveBackground />} />
          <Route path="remove-object" element={<RemoveObject />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="blog-titles" element={<BlogTitles />} />
        </Route>

      </Routes>
    </div>
  );
};

export default App;
