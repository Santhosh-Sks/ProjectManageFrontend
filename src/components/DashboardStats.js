import React from 'react';
import { FaProjectDiagram, FaTasks, FaCheckCircle, FaUsers } from 'react-icons/fa';

const DashboardStats = ({ stats }) => {
    const cards = [
        {
            label: "Total Projects",
            value: stats.totalProjects,
            icon: <FaProjectDiagram className="text-3xl text-indigo-500" />,
            bg: "bg-indigo-50"
        },
        {
            label: "Active Tasks",
            value: stats.activeTasks,
            icon: <FaTasks className="text-3xl text-yellow-500" />,
            bg: "bg-yellow-50"
        },
        {
            label: "Completed Tasks",
            value: stats.completedTasks,
            icon: <FaCheckCircle className="text-3xl text-green-500" />,
            bg: "bg-green-50"
        },
        {
            label: "Team Members",
            value: stats.teamMembers,
            icon: <FaUsers className="text-3xl text-blue-500" />,
            bg: "bg-blue-50"
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`flex items-center justify-between p-5 rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 ${card.bg}`}
                >
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500">{card.label}</h3>
                        <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                    </div>
                    <div className="ml-4">{card.icon}</div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
