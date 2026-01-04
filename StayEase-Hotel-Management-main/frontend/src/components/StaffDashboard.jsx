// import React, { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import ManageBookings from './ManageBookings';
// console.log("Modal imported:" );

// import { 
//   LogOut, 
//   Users, 
//   ClipboardList, 
//   Calendar,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   UserCheck
// } from 'lucide-react';
// import { logoutUser, getAllBookings, updateBookingStatus, getHousekeepingTasks } from '../lib/mock';
// import { useToast } from '../hooks/use-toast';
// import { useAuth } from "../context/AuthContext";
// const StaffDashboard = () => {
//   const { user, setUser , logout } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [housekeepingTasks, setHousekeepingTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     try {
//       const allBookings = getAllBookings();
//       const tasks = getHousekeepingTasks();
      
//       setBookings(allBookings);
//       setHousekeepingTasks(tasks);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load dashboard data",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     logoutUser();
//     setUser(null);
//     toast({
//       title: "Logged out",
//       description: "You have been successfully logged out",
//     });
//   };

//   const handleUpdateBooking = (bookingId, newStatus) => {
//     updateBookingStatus(bookingId, newStatus);
//     setBookings(prev => prev.map(booking => 
//       booking.id === bookingId ? { ...booking, status: newStatus } : booking
//     ));
//     toast({
//       title: "Status Updated",
//       description: `Booking status changed to ${newStatus}`,
//     });
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'confirmed': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       case 'completed': return 'bg-blue-100 text-blue-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const todayBookings = bookings.filter(booking => 
//     new Date(booking.checkIn).toDateString() === new Date().toDateString()
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading Staff Dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">staff Dashboard</h1>
//               <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
//             </div>
//             <Button onClick={logout} variant="outline" className="flex items-center gap-2">
//               <LogOut className="h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Today's Check-ins</CardTitle>
//               <UserCheck className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-blue-600">{todayBookings.length}</div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-green-600">
//                 {bookings.filter(b => b.status === 'confirmed').length}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
//               <ClipboardList className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-amber-600">
//                 {housekeepingTasks.filter(t => t.status === 'pending').length}
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold text-purple-600">48</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content Tabs */}
//         <Tabs defaultValue="bookings" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
//             <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
//           </TabsList>

//           <TabsContent value="bookings" className="space-y-6">
            
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Calendar className="h-5 w-5" />
//                   Recent Bookings not yet managed
//                 </CardTitle>
//                 <CardDescription>
//                   Manage customer bookings and room assignments
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ManageBookings  />

//                 {/* <div className="space-y-4">
//                   {bookings.slice(0, 8).map((booking) => (
//                     <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-3">
//                           <h3 className="font-medium text-gray-900">{booking.guestName}</h3>
//                           <Badge className={getStatusColor(booking.status)}>
//                             {booking.status}
//                           </Badge>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                           Room {booking.roomNumber} • {booking.roomType}
//                         </p>
//                         <p className="text-sm text-gray-500">
//                           {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         {booking.status === 'pending' && (
//                           <>
//                             <Button
//                               size="sm"
//                               onClick={() => handleUpdateBooking(booking.id, 'confirmed')}
//                               className="bg-green-600 hover:bg-green-700"
//                             >
//                               <CheckCircle className="h-4 w-4 mr-1" />
//                               Confirm
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleUpdateBooking(booking.id, 'cancelled')}
//                               className="border-red-200 text-red-600 hover:bg-red-50"
//                             >
//                               Cancel
//                             </Button>
//                           </>
//                         )}
//                         {booking.status === 'confirmed' && (
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleUpdateBooking(booking.id, 'completed')}
//                           >
//                             <CheckCircle className="h-4 w-4 mr-1" />
//                             Complete
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div> */}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="housekeeping" className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <ClipboardList className="h-5 w-5" />
//                   Housekeeping Tasks
//                 </CardTitle>
//                 <CardDescription>
//                   Track room cleaning and maintenance tasks
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {housekeepingTasks.map((task) => (
//                     <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
//                       <div className="flex items-center gap-4">
//                         {task.status === 'pending' ? (
//                           <Clock className="h-5 w-5 text-amber-500" />
//                         ) : task.status === 'completed' ? (
//                           <CheckCircle className="h-5 w-5 text-green-500" />
//                         ) : (
//                           <AlertCircle className="h-5 w-5 text-red-500" />
//                         )}
//                         <div>
//                           <h3 className="font-medium text-gray-900">Room {task.roomNumber}</h3>
//                           <p className="text-sm text-gray-600">{task.task}</p>
//                           <p className="text-sm text-gray-500">Priority: {task.priority}</p>
//                         </div>
//                       </div>
//                       <Badge className={getStatusColor(task.status)}>
//                         {task.status}
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default StaffDashboard;





// import React, { useEffect, useState } from "react";

// export default function StaffDashboard() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBooking, setSelectedBooking] = useState(null); // booking being assigned
//   const [availableRooms, setAvailableRooms] = useState([]); // fetched rooms
//   const [selectedRoom, setSelectedRoom] = useState(""); // chosen room

//   // ✅ Fetch all bookings
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/staff/bookings");
//         const data = await res.json();
//         setBookings(data);
//       } catch (err) {
//         console.error("Error fetching bookings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookings();
//   }, []);

//   // ✅ Fetch available rooms for that booking's room type
//   const fetchAvailableRooms = async (booking) => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/rooms/available?roomType=${booking.roomType}&checkIn=${booking.checkIn}&checkOut=${booking.checkOut}`
//       );
//       const data = await res.json();
//       setAvailableRooms(data);
//       setSelectedBooking(booking);
//       setSelectedRoom(""); // reset
//     } catch (err) {
//       console.error("Error fetching available rooms:", err);
//     }
//   };

//   // ✅ Assign room
//   const handleAssignRoom = async () => {
//     if (!selectedRoom) {
//       alert("Please select a room");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/staff/bookings/${selectedBooking._id}/assign-room`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ roomId: selectedRoom }),
//         }
//       );

//       if (res.ok) {
//         alert("Room assigned successfully!");
//         // Update local state
//         setBookings((prev) =>
//           prev.map((b) =>
//             b._id === selectedBooking._id
//               ? { ...b, status: "checked-in", room: selectedRoom }
//               : b
//           )
//         );
//         setSelectedBooking(null);
//         setAvailableRooms([]);
//       } else {
//         alert("Failed to assign room");
//       }
//     } catch (err) {
//       console.error("Error assigning room:", err);
//     }
//   };

//   if (loading) return <p className="p-4">Loading bookings...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Receptionist Dashboard</h1>

//       <table className="w-full border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="p-2 border">Guest</th>
//             <th className="p-2 border">Room Type</th>
//             <th className="p-2 border">Status</th>
//             <th className="p-2 border">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((booking) => (
//             <tr key={booking._id} className="border">
//               <td className="p-2 border">{booking.guestName}</td>
//               <td className="p-2 border">{booking.roomType}</td>
//               <td className="p-2 border">{booking.status}</td>
//               <td className="p-2 border">
//                 {booking.status === "pending" ? (
//                   <button
//                     onClick={() => fetchAvailableRooms(booking)}
//                     className="px-3 py-1 bg-blue-500 text-white rounded"
//                   >
//                     Assign Room
//                   </button>
//                 ) : (
//                   <span className="text-green-600">✔ {booking.room}</span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ✅ Show modal-like section for room selection */}
//       {selectedBooking && (
//         <div className="mt-6 p-4 border rounded bg-gray-100">
//           <h2 className="text-lg font-semibold mb-2">
//             Assign Room for {selectedBooking.guestName}
//           </h2>

//           {availableRooms.length > 0 ? (
//             <>
//               <select
//                 value={selectedRoom}
//                 onChange={(e) => setSelectedRoom(e.target.value)}
//                 className="p-2 border rounded mr-2"
//               >
//                 <option value="">Select Room</option>
//                 {availableRooms.map((room) => (
//                   <option key={room._id} value={room._id}>
//                     Room {room.roomNumber}
//                   </option>
//                 ))}
//               </select>
//               <button
//                 onClick={handleAssignRoom}
//                 className="px-4 py-2 bg-green-600 text-white rounded"
//               >
//                 Confirm Assign
//               </button>
//             </>
//           ) : (
//             <p>No available rooms for this type</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }









import React from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from './ui/button';
import { Bed, Bell, LogOut } from 'lucide-react';

const StaffDashboard = () => { 
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Please login to access the staff dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bed className="h-8 w-8 text-amber-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                  Staff Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role ? user.role : "No role assigned"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Role assignment message */}
      {!user?.role || !user?.department ? (
        <div className="mt-8 p-6 text-center bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">
            You are not assigned to any staff role or department currently.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-gray-700">
            Welcome, <span className="font-semibold">{user.role}</span> from{" "}
            <span className="font-semibold">{user.department}</span> department 🎉
          </p>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
