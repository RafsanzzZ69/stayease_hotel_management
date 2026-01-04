import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, CheckCircle, UserCheck } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';
import  Modal  from './ui/Modal'; // Assuming you have a modal component
console.log("Modal imported:", Modal);
import { useAuth } from "../context/AuthContext";
const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/api/staff/getAllBookings');
      setBookings(res.data.bookings);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoomClick = async (booking) => {
    try {
      setSelectedBooking(booking);
      const res = await axios.post('http://localhost:3000/api/availability/room-type', {
        roomType: booking.roomType._id,
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut
      });
      setAvailableRooms(res.data.availableRooms);
      setModalOpen(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch available rooms",
        variant: "destructive"
      });
    }
  };

  const handleAssignRoomConfirm = async () => {
    if (!selectedRoom || !selectedBooking) return;
    try {
      await axios.post(`http://localhost:3000/api/staff/bookings/${selectedBooking.id}/assign-room`, {
        roomId: selectedRoom._id
      });
      toast({
        title: "Success",
        description: `Room ${selectedRoom.roomNumber} assigned!`
      });
      setModalOpen(false);
      setSelectedRoom(null);
      setSelectedBooking(null);
      loadBookings(); // refresh bookings
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign room",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBooking = async (bookingId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/staff/${bookingId}/status`, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`
      });
      loadBookings(); // refresh bookings
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking._id} className="flex items-center justify-between p-4 border rounded-lg bg-white/50">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900">{booking.user.name}</h3>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              Room {booking.room || "Not Assigned"} • {booking.roomType.roomTypeName}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            {!booking.room && booking.status?.toLowerCase() !== "completed" && (
              <Button size="sm" onClick={() => handleAssignRoomClick(booking)}>
                Assign Room 
              </Button>
            )}
            {/* Check-in */}
  {booking.room && booking.status === "confirmed" && (
    <Button size="sm" onClick={() => handleUpdateBooking(booking.id, "checked-in")}>
      Check-in
    </Button>
  )}


  {/* Complete */}
  {booking.status === "checked-in" && (
    <Button size="sm" onClick={() => handleUpdateBooking(booking.id, "completed")}>
      Complete
    </Button>
  )}

  {/* Cancel */}
  {booking.status === "confirmed" && (
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleUpdateBooking(booking.id, "cancelled")}
    >
      Cancel
    </Button>
  )}
            {/* {booking.status === 'checked-in' && (
              <>
                <Button size="sm" onClick={() => handleUpdateBooking(booking.id, 'completed')}>
                  Complete
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUpdateBooking(booking.id, 'cancelled')}>
                  Cancel
                </Button>
              </>
            )} */}
            {/* {booking.status === 'confirmed' && (
              <Button size="sm" variant="outline" onClick={() => handleUpdateBooking(booking.id, 'checked-in')}>
                Check-in
              </Button>
            )} */}
          </div>
        </div>
      ))}

      {/* Modal for assigning room */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} title="Select Room to Assign">
          <div className="space-y-2">
            {availableRooms.length === 0 ? (
              <p>No rooms available for this type and date range.</p>
            ) : availableRooms.map(room => (
              <div key={room._id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedRoom(room)}
              >
                <p>Room {room.roomNumber}</p>
                {selectedRoom?._id === room._id && <CheckCircle className="text-green-500" />}
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <Button onClick={handleAssignRoomConfirm} disabled={!selectedRoom}>
                Assign Room
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ManageBookings;
