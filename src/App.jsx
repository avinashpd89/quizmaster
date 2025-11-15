import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home/Home_1";
import Contact from "./components/Contact";
import About from "./components/About";
import Upload from "./upload/Upload";
import Signup from "./components/Signup";
import Result from "./components/Result/Result";
import Question from "./components/QuestionDisplay/question";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/result" element={<Result />} />
          <Route path="/question" element={<Question />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </>
  );
}

export default App;
