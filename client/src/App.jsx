import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PostOrden, Ordenes, Navbar, Doctores, CreateDoctor } from "./pages";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PostOrden />} />
          <Route path="/doctores" element={<Doctores />} />
          <Route path="/crear-doctor" element={<CreateDoctor />} />
          <Route path="/ordenes" element={<Ordenes />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;