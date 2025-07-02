import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import Project from './components/Project';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProjectList />} />
          <Route path="/projects/:id" element={<Project />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;