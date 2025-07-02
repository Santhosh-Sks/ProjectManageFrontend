import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import ProjectList from '../components/ProjectList';
import Project from '../components/Project';

const Projects = () => {
    return (
        <Routes>
            <Route path="/" element={<ProjectList />} />
            <Route path="/new" element={<ProjectList />} />
            <Route path="/:id" element={<Project />} />
        </Routes>
    );
};

export default Projects; 