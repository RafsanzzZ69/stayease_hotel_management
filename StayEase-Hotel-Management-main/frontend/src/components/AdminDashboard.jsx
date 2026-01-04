// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  LogOut,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Building,
  UserCheck,
  Star,
} from "lucide-react";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../context/AuthContext";
import UserDrawer from "./UserDrawer";

const AdminDashboard = () => {
  const { user, setUser , logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypesLoading, setRoomTypesLoading] = useState(false);

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const [roomForm, setRoomForm] = useState({
  roomTypeName: "",
  description: "",
  sizeSqm: "",
  bedType: "",
  view: "Ocean",
  features: "",
  amenities: "",
  pricePerNight: "",
  totalRooms: "",
  maxAdults: "",
  maxChildren: "",
  images: [],
});

  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [bookingsRes, usersRes, revenueRes] = await Promise.all([
        axios.get("http://localhost:3000/api/admin/bookings"),
        axios.get("http://localhost:3000/api/admin/users"),
        axios.get("http://localhost:3000/api/admin/revenue"),
      ]);

      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
      setRevenue(revenueRes.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "guest":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // ✅ Handle Save User
  const handleSave = async (updatedUser) => {
    try {
      await axios.patch(`http://localhost:3000/api/admin/users/${updatedUser._id}/role`, {
        salary: updatedUser.salary,
        department: updatedUser.department,
        departmentRole: updatedUser.departmentRole,
        floorNumber: updatedUser.floorNumber,
      });

      toast({ title: "Success", description: "User updated successfully" });
      setDrawerOpen(false);
      loadDashboardData();
    } catch (error) {
      toast({ title: "Error", description: error.response?.data?.message || "Update failed", variant: "destructive" });
    }
  };

  // ✅ Handle Delete User
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${selectedUser._id}`);
      toast({ title: "Deleted", description: "User deleted successfully" });
      setDrawerOpen(false);
      loadDashboardData();
    } catch (error) {
      toast({ title: "Error", description: error.response?.data?.message || "Delete failed", variant: "destructive" });
    }
  };

  const totalRevenue = revenue.totalRevenue || 0;
  const monthlyRevenue = revenue.monthlyRevenue || 0;
  const occupancyRate = revenue.occupancyRate || 0;
  const totalUsers = revenue.totalUsers || 0;
  const totalBookings = revenue.totalBookings || 0;
  const monthlyBookings = revenue.monthlyBookings || 0;
  const currentlyActiveBookings = revenue.currentlyActiveBookings || 0;
  const customerSatisfaction = revenue.customerSatisfaction || 0;
  const bookingConversion = revenue.bookingConversion || 0;
  const repeatCustomers = revenue.repeatCustomers || 0;

  //changing 

const handleRoomChange = (e) => {
  const { name, value } = e.target;
  setRoomForm((prev) => ({ ...prev, [name]: value }));
};

const handleImageChange = (e) => {
  setRoomForm((prev) => ({
    ...prev,
    images: Array.from(e.target.files),
  }));
};

const handleCreateRoomType = async (e) => {
  e.preventDefault();
  if (isCreatingRoom) return; // extra safety

  setIsCreatingRoom(true); // 🔒 lock button

  try {
    const formData = new FormData();

    formData.append("roomTypeName", roomForm.roomTypeName);
    formData.append("description", roomForm.description);
    formData.append("sizeSqm", Number(roomForm.sizeSqm));
    formData.append("bedType", roomForm.bedType);
    formData.append("view", roomForm.view);
    formData.append("pricePerNight", Number(roomForm.pricePerNight));
    formData.append("totalRooms", Number(roomForm.totalRooms));

    // nested object
    formData.append(
      "maxOccupancy",
      JSON.stringify({
        adults: Number(roomForm.maxAdults),
        children: Number(roomForm.maxChildren) || 0,
      })
    );

    // arrays
    formData.append(
      "features",
      JSON.stringify(
        roomForm.features.split(",").map((f) => f.trim())
      )
    );

    formData.append(
      "amenities",
      JSON.stringify(
        roomForm.amenities.split(",").map((a) => a.trim())
      )
    );

    // images
    roomForm.images.forEach((img) => {
      formData.append("images", img);
    });

    await axios.post(
      "http://localhost:3000/api/roomtypes",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    toast({
      title: "Success",
      description: "Room type created successfully",
    });

    // reset form
    setRoomForm({
      roomTypeName: "",
      description: "",
      sizeSqm: "",
      bedType: "",
      view: "Ocean",
      features: "",
      amenities: "",
      pricePerNight: "",
      totalRooms: "",
      maxAdults: "",
      maxChildren: "",
      images: [],
    });

  } catch (error) {
    toast({
      title: "Error",
      description:
        error.response?.data?.message || "Failed to create room type",
      variant: "destructive",
    });
  }  finally {
    setIsCreatingRoom(false); // 🔓 unlock button
  }
};


const loadRoomTypes = async () => {
  try {
    setRoomTypesLoading(true);
    const res = await axios.get("http://localhost:3000/api/roomtypes");
    setRoomTypes(res.data);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to load room types",
      variant: "destructive",
    });
  } finally {
    setRoomTypesLoading(false);
  }
};



  //changing

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <Button onClick={logout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalBookings.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Bookings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {monthlyBookings.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{currentlyActiveBookings}</div>
            </CardContent>
          </Card>
          

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="flex w-full flex-wrap gap-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="bookings">All Bookings</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="rooms">Room Management</TabsTrigger>
            <TabsTrigger value="roomtypes" onClick={loadRoomTypes}>Room Types</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <span className="font-semibold text-green-600">
                        ${totalRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-semibold text-blue-600">
                        ${monthlyRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Occupancy Rate</span>
                      <span className="font-semibold text-amber-600">{occupancyRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Keeping mock values */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Customer Satisfaction</span>
                      <Badge className="bg-green-100 text-green-800">{customerSatisfaction}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Booking Conversion</span>
                      <Badge className="bg-blue-100 text-blue-800">{bookingConversion}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Repeat Customers</span>
                      <Badge className="bg-purple-100 text-purple-800">{repeatCustomers}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  All Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-gray-900">{booking.userId.name}</h3>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Room {booking.roomNumber} • {booking.roomTypeId.roomTypeName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${booking.totalPrice}</p>
                        {/* <p className="text-sm text-gray-500">{booking.nights} nights</p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((userData) => (
                    <div
                      key={userData._id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {userData.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{userData.name}</h3>
                          <p className="text-sm text-gray-600">{userData.email}</p>
                          <p className="text-sm text-gray-500">
                            Joined: {new Date(userData.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getRoleColor(userData.accountType)}>{userData.accountType}</Badge>
                        <button
    onClick={() => {
      setSelectedUser(userData);
      setDrawerOpen(true);
    }}
    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    Edit
  </button>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <UserCheck className="h-4 w-4" />
                          Active
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>







{/* Room Management Tab */}
<TabsContent value="rooms" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building className="h-5 w-5" />
        Add Room Type
      </CardTitle>
      <CardDescription>
        Create a new room category that guests can book
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form
  onSubmit={handleCreateRoomType}
> <fieldset
    disabled={isCreatingRoom}
    className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
      isCreatingRoom ? "opacity-60" : ""
    }`}
  >


        {/* Room Type Name */}
        <div>
          <label className="text-sm font-medium">Room Type Name</label>
          <input
  type="text"
  name="roomTypeName"
  value={roomForm.roomTypeName}
  onChange={handleRoomChange}
  placeholder="Penthouse Sea View"
  className="mt-1 w-full border rounded-lg px-3 py-2"
/>

        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium">Price per Night ($)</label>
          <input
  type="number"
  name="pricePerNight"
  value={roomForm.pricePerNight}
  onChange={handleRoomChange}
  className="mt-1 w-full border rounded-lg px-3 py-2"
/>

        </div>

        {/* Size */}
        <div>
          <label className="text-sm font-medium">Size (sqm)</label>
          <input
  type="number"
  name="sizeSqm"
  value={roomForm.sizeSqm}
  onChange={handleRoomChange}
  placeholder="120"
  className="mt-1 w-full border rounded-lg px-3 py-2"
/>

        </div>

        {/* Bed Type */}
        <div>
          <label className="text-sm font-medium">Bed Type</label>
          <input
            type="text"
            name="bedType"
            value={roomForm.bedType}
            onChange={handleRoomChange}
            placeholder="King Bed"
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* View */}
        <div>
          <label className="text-sm font-medium">View</label>
          <select name="view" value={roomForm.view} onChange={handleRoomChange} className="mt-1 w-full border rounded-lg px-3 py-2">
            <option>Ocean</option>
            <option>City</option>
            <option>Hill</option>
            <option>Garden</option>
          </select>
        </div>

        {/* Total Rooms */}
        <div>
          <label className="text-sm font-medium">Total Rooms</label>
          <input
            type="number"
            name="totalRooms"
            value={roomForm.totalRooms}
            onChange={handleRoomChange}
            placeholder="10"
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Max Occupancy */}
        <div>
          <label className="text-sm font-medium">Max Adults</label>
          <input
            type="number"
            name="maxAdults"
            value={roomForm.maxAdults}
            onChange={handleRoomChange}
            placeholder="2"
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Max Children</label>
          <input
            type="number"
            name="maxChildren"
            value={roomForm.maxChildren}
            onChange={handleRoomChange}
            placeholder="1"
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Features */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Features (comma separated)</label>
          <input
  type="text"
  name="features"
  value={roomForm.features}
  onChange={handleRoomChange}
  placeholder="Private Pool, Jacuzzi"
  className="mt-1 w-full border rounded-lg px-3 py-2"
/>

        </div>

        {/* Amenities */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Amenities (comma separated)</label>
          <input
            type="text"
            name="amenities"
            value={roomForm.amenities}
            onChange={handleRoomChange}
            placeholder="WiFi, Minibar, Spa Access"
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows="3"
            name="description"
            value={roomForm.description}
            onChange={handleRoomChange}
            placeholder="Luxury sea-facing suite with premium facilities..."
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Room Images</label>
          <input
  type="file"
  multiple
  accept="image/*"
  onChange={handleImageChange}
  className="mt-2"
/>

          <p className="text-xs text-gray-500 mt-1">
            Upload high-quality room images (JPG/PNG)
          </p>
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <Button
  type="submit"
  disabled={isCreatingRoom}
  className={`bg-amber-600 hover:bg-amber-700 ${
    isCreatingRoom ? "opacity-70 cursor-not-allowed" : ""
  }`}
>
  {isCreatingRoom ? "Creating Room..." : "Create Room Type"}
</Button>


        </div>
</fieldset>
      </form>
    </CardContent>
  </Card>
</TabsContent>

          {/* Room Types Tab */}

<TabsContent value="roomtypes" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building className="h-5 w-5" />
        All Room Types
      </CardTitle>
      <CardDescription>
        View all available room categories and their details
      </CardDescription>
    </CardHeader>

    <CardContent>
      {roomTypesLoading ? (
        <p className="text-gray-500">Loading room types...</p>
      ) : roomTypes.length === 0 ? (
        <p className="text-gray-500">No room types found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roomTypes.map((room) => (
            <div
              key={room._id}
              className="border rounded-xl overflow-hidden bg-white shadow-sm"
            >
              {/* Image */}
              <div className="h-48 bg-gray-100">
                {room.images?.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.roomTypeName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold">
                  {room.roomTypeName}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {room.description}
                </p>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium text-green-600">
                    ${room.pricePerNight} / night
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Occupancy</span>
                  <span>
                    {room.maxOccupancy?.adults} Adults
                    {room.maxOccupancy?.children > 0 &&
                      `, ${room.maxOccupancy.children} Children`}
                  </span>
                </div>

                {/* Features */}
                {room.features?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {room.features.slice(0, 3).map((f, i) => (
                      <Badge key={i} variant="secondary">
                        {f}
                      </Badge>
                    ))}
                    {room.features.length > 3 && (
                      <Badge variant="outline">
                        +{room.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>


        </Tabs>
      </div>


      <UserDrawer
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  user={selectedUser}
  onSave={handleSave}
  onDelete={handleDelete}
/>

    </div>

        // user drawer 
        

    
  );
};

export default AdminDashboard;
