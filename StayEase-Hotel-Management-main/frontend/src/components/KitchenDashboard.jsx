// src/pages/KitchenDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Bed, 
  Calendar, 
  CreditCard, 
  Bell, 
  Star, 
  MapPin, 
  LogOut,
  Plus,
  ShoppingCart,
  Clock,
  CheckCircle,
  Package
} from 'lucide-react';
import { fetchFoodOrders, updateOrderStatus } from "./api/kitchenAPI.js";
import { useAuth } from "../context/AuthContext";
import socket from "../socket"; // single shared socket
import axios from "axios";


const KitchenDashboard = () => {
  const { user , logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
      const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Fetch orders when dashboard loads
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchFoodOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);


  // ✅ Setup socket listeners
  useEffect(() => {
    socket.on("foodOrderCreated", (newOrder) => {
      console.log("📦 New order received:", newOrder);
      setOrders((prev) => [...prev, newOrder]);
    });

    socket.on("foodOrderUpdated", (updatedOrder) => {
      console.log("🔄 Food order updated:", updatedOrder);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off("foodOrderCreated");
      socket.off("foodOrderUpdated");
    };
  }, []);


  // ✅ Handle status change
  // const handleStatusChange = async (id, newStatus , assignedTo = user.id) => {
  //   try {
  //     await updateOrderStatus(id, newStatus, assignedTo);
  //     setOrders((prev) =>
  //       prev.map((order) =>
  //         order._id === id ? { ...order, status: newStatus } : order
  //       )
  //     );
  //   } catch (err) {
  //     console.error("Error updating status:", err);
  //   }
  // };

  // ✅ Handle status change (with assignedTo logic)
  const handleStatusChange = async (id, newStatus, assignedTo = user.id) => {
    try {
      await updateOrderStatus(id, newStatus, assignedTo);
      // ⚡ no need to manually update state here
      // because backend will emit "orderUpdated"
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };


  //notify chef

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


  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-4">
      {/* Header */}
      {/* <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bed className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                StayEase
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
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
                 

                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <h1 className="text-xl font-bold mb-4">🍳 Kitchen Dashboard</h1>

    {orders.length === 0 ? (
      <p>No food orders right now.</p>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-4 border rounded-lg shadow bg-white"
          >
            <p className="font-semibold">
              Room: {order.roomNumber} | Status:{" "}
              <span
                className={`px-2 py-1 rounded text-white ${
                  order.status === "Pending"
                    ? "bg-yellow-500"
                    : order.status === "Preparing"
                    ? "bg-blue-500"
                    : order.status === "In Progress"
                    ? "bg-purple-500"
                    : order.status === "Delivered"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              >
                {order.status}
              </span>
            </p>
            <p className="font-semibold">
              Assigned To: {order.assignedTo ? order.assignedTo.name : "Unassigned"}
            </p>

            <ul className="mt-2 list-disc list-inside text-sm">
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              {/* Any chef can pick pending order */}
              {order.status === "Pending" && (
                <button
                  onClick={() =>
                    handleStatusChange(order._id, "Preparing")
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Start Preparing
                </button>
              )}

              {/* Only assigned chef can move forward */}
              {user.id === order.assignedTo?._id && (
                <>
                  {order.status === "Preparing" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order._id, "In Progress")
                      }
                      className="px-3 py-1 bg-purple-500 text-white rounded"
                    >
                      Mark In Progress
                    </button>
                  )}

                  {order.status === "In Progress" && (
                    <button
                      onClick={() =>
                        handleStatusChange(order._id, "Delivered")
                      }
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Mark Delivered
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
);}


export default KitchenDashboard;





// import React, { useEffect, useState } from "react";
// import { fetchFoodOrders, updateOrderStatus } from "../services/serviceRequestAPI";
// import { useAuth } from "../context/AuthContext";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3000"); // backend port

// const KitchenDashboard = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);

//   // Load initial orders
//   const loadOrders = async () => {
//     try {
//       const data = await fetchFoodOrders();
//       setOrders(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadOrders();

//     // ✅ Listen for real-time updates
//     socket.on("orderCreated", (newOrder) => {
//       setOrders((prev) => [...prev, newOrder]);
//     });

//     socket.on("orderUpdated", (updatedOrder) => {
//       setOrders((prev) =>
//         prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
//       );
//     });

//     return () => {
//       socket.off("orderCreated");
//       socket.off("orderUpdated");
//     };
//   }, []);

//   // ✅ Update order
//   const handleStatusChange = async (order, newStatus) => {
//     try {
//       const assignedTo =
//         order.status === "Pending" && newStatus === "Preparing"
//           ? user.id
//           : undefined;

//       await updateOrderStatus(order._id, newStatus, assignedTo);
//       // No need to manually update state here, socket event will do it!
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">🍳 Kitchen Dashboard (Live)</h1>

//       {orders.length === 0 ? (
//         <p>No orders right now.</p>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => (
//             <div key={order._id} className="p-4 border rounded bg-white shadow">
//               <p>
//                 Room: {order.roomNumber} | Status:{" "}
//                 <b>{order.status}</b>
//               </p>
//               <p>
//                 Assigned To: {order.assignedTo?.name || "Unassigned"}
//               </p>
//               <ul className="list-disc ml-6">
//                 {order.items.map((item, i) => (
//                   <li key={i}>{item.name} × {item.quantity}</li>
//                 ))}
//               </ul>

//               <div className="mt-2 flex gap-2">
//                 {order.status === "Pending" && (
//                   <button
//                     onClick={() => handleStatusChange(order, "Preparing")}
//                     className="px-3 py-1 bg-blue-500 text-white rounded"
//                   >
//                     Start Preparing
//                   </button>
//                 )}
//                 {user.id === order.assignedTo?._id && order.status === "Preparing" && (
//                   <button
//                     onClick={() => handleStatusChange(order, "In Progress")}
//                     className="px-3 py-1 bg-purple-500 text-white rounded"
//                   >
//                     Mark In Progress
//                   </button>
//                 )}
//                 {user.id === order.assignedTo?._id && order.status === "In Progress" && (
//                   <button
//                     onClick={() => handleStatusChange(order, "Delivered")}
//                     className="px-3 py-1 bg-green-500 text-white rounded"
//                   >
//                     Mark Delivered
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default KitchenDashboard;
