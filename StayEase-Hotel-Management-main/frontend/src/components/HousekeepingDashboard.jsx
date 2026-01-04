import React, { useEffect, useState } from "react";
import { Button } from './ui/button';
import { Bed, Bell, LogOut } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { fetchHousekeepingTasks, updateTaskStatus } from "./api/houseKeepingAPI.js";
import socket from "../socket";
import axios from "axios";
const HousekeepingDashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
const [showDropdown, setShowDropdown] = useState(false);
  // Fetch tasks on load
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchHousekeepingTasks(user.id);
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [user.id]);

  // Socket listeners for real-time updates
  useEffect(() => {
    socket.on("housekeepingRequestCreated", (newTask) => {
      if (newTask.assignedTo?._id === user.id) {
        setTasks((prev) => [...prev, newTask]);
      }
    });

    socket.on("housekeepingRequestUpdated", (updatedTask) => {
      if (updatedTask.assignedTo?._id === user.id) {
        setTasks((prev) =>
          prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
      }
    });

    return () => {
      socket.off("housekeepingRequestCreated");
      socket.off("housekeepingRequestUpdated");
    };
  }, [user.id]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      // ⚡ state will auto-update via socket
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  // Fetch notifications
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/notifications/${user.id}` // use _id consistently
      );
      setNotifications(res.data.notifications); 
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoadingNotifications(false);
    }
  };

  if (user?.id) fetchNotifications();
}, [user]);

// Real-time notifications via socket
useEffect(() => {
  if (!user?.id) return;

  socket.on("newNotification", (notification) => {
    if (notification.user == user.id) {
      setNotifications((prev) => [notification, ...prev]);
    }
  });

  return () => {
    socket.off("newNotification");
  };
}, [user]);

  if (loading) return <p>Loading housekeeping tasks...</p>;

  return (
    <div className="p-4">
      {/* Header */}
      {/* <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 mb-4">
        <div className="flex justify-between items-center h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <Bed className="h-8 w-8 text-amber-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
              StayEase Housekeeping
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">Floor Number: {user.floorNumber}</p>

              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header> */}


      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bed className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                StayEase
              </h1>
            </div>
            <div className="flex items-center space-x-4">
        

{/* </div> */}
<div className="relative">
  {/* Bell Icon */}
  <div
    className="relative cursor-pointer"
    onClick={() => setShowDropdown(!showDropdown)}
  >
    <Bell className="h-6 w-6 text-gray-600" />
    {notifications.some((n) => !n.read) && (
      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
    )}
  </div>

  {/* Dropdown */}
  {showDropdown && (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border overflow-hidden z-50">
      <div className="p-2 font-semibold border-b">Notifications</div>
      <div className="max-h-64 overflow-y-auto">
        {loadingNotifications ? (
          <p className="text-sm text-gray-500 p-2">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-gray-500 p-2">No notifications</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={async () => {
                try {
                  await axios.patch(
                    `http://localhost:3000/api/notifications/read/${n._id}`
                  );
                  setNotifications((prev) =>
                    prev.map((x) =>
                      x._id === n._id ? { ...x, read: true } : x
                    )
                  );
                } catch (err) {
                  console.error("Failed to mark as read", err);
                }
              }}
              className={`p-2 border-b cursor-pointer hover:bg-gray-50 ${
                !n.read ? "bg-blue-50" : ""
              }`}
            >
              <p className="text-sm text-gray-700">{n.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )}
</div>



              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  <p className="text-xs text-gray-500 capitalize">Floor Number: {user.floorNumber}</p>

                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <h1 className="text-xl font-bold mb-4">🧹 Housekeeping Tasks</h1>

      {tasks.length === 0 ? (
        <p>No housekeeping tasks assigned to you.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task._id} className="p-4 border rounded-lg shadow bg-white">
              <p className="font-semibold">
                Room: {task.roomNumber} | Status:{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    task.status === "Pending"
                      ? "bg-yellow-500"
                      : task.status === "In Progress"
                      ? "bg-blue-500"
                      : task.status === "Completed"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  {task.status}
                </span>
              </p>
              <p className="font-semibold">Requested By: {task.user?.name || "Guest"}</p>

              <ul className="mt-2 list-disc list-inside text-sm">
                {task.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-2">
                {user.id === task.assignedTo?._id && (
                  <>
                    {task.status === "Pending" && (
                      <button
                        onClick={() => handleStatusChange(task._id, "In Progress")}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Start Cleaning
                      </button>
                    )}
                    {task.status === "In Progress" && (
                      <button
                        onClick={() => handleStatusChange(task._id, "Completed")}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Mark Completed
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HousekeepingDashboard;



