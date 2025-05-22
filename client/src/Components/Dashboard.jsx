import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/dashboard/view_tasks", {
        withCredentials: true,
      })
      .then((result) => {
        setTasks(result.data.data);
      })
      .catch((err) => {
        console.log("Error fetching tasks:", err);
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/dashboard", {
        withCredentials: true,
      })
      .then((result) => {
        setUsers(result.data.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null);
        navigate("/Userlogin");
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {user?.username}
          </p>
        </div>
        <div className="space-x-4">
          <Link
            to="/dashboard/add_tasks"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Add Task
          </Link>
          <Link
            to="/dashboard/view_tasks"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          >
            View Tasks
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            User Task Overview
          </h2>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 border-b border-gray-200">ID</th>
                <th className="px-4 py-2 border-b border-gray-200">Name</th>
                <th className="px-4 py-2 border-b border-gray-200">Task</th>
                <th className="px-4 py-2 border-b border-gray-200">Status</th>
              </tr>
            </thead>
            {/* <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border-b">{user.id}</td>
                    <td className="px-4 py-2 border-b">{user.username}</td>
                    <td className="px-4 py-2 border-b">{user.title || "N/A"}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          user.taskStatus === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {user.taskStatus || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    No users or tasks found.
                  </td>
                </tr>
              )}
            </tbody> */}
            <tbody className="text-gray-700">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr
                    key={task.id || index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-5 py-4">{task.id}</td>
                    <td className="px-5 py-4">{task.title}</td>
                    <td className="px-5 py-4">{task.description}</td>
                     <td className="px-4 py-2 border-b">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          task.status === "Done"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {task.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500 font-medium"
                  >
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
