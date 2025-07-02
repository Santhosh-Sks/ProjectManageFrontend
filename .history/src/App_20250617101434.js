import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import Project from './components/Project';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/projects/:id" element={<Project />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;