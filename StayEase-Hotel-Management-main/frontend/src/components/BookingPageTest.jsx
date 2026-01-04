import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Navigate } from "react-router-dom";
import { 
  Bed, 
  Calendar as CalendarIcon,
  Users, 
  Star, 
  Wifi, 
  Tv, 
  Car,
  Coffee,
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  CheckCircle,
  Sparkles
} from 'lucide-react';

import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from "../context/AuthContext";
import {bookRoom} from './api/handelBookingAPI';

const BookingPage = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAvailability = async () => {
    if (!checkIn || !checkOut || guests < 1) {
      toast({
        title: "Missing Information",
        description: "Please select check-in, check-out, and number of guests",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setLoadingRooms(true);
    try {
      const res = await fetch('http://localhost:3000/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
          guests,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch rooms');

      setAvailableRooms(data.availableRoomTypes || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
      setAvailableRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };


  // Callback uses the payload
const handleBookingSuccess = async () => {
  if (!selectedRoom) return; // safety check

  const payload = {
    userId: user.id,
    roomTypeId: selectedRoom.roomType._id,
    checkInDate: checkIn.toISOString(),
    checkOutDate: checkOut.toISOString(),
    guests,
  };

  await bookRoom(payload);
};



//   const handleBooking = async () => {
//     if (!selectedRoom) {
//       toast({
//         title: "No Room Selected",
//         description: "Please select a room to book",
//         variant: "destructive",
//         duration: 3000,
//       });
//       return;
//     }

//     // 🔹 Log the payload before sending
//   const payload = {
//     userId: user.id,
//     roomTypeId: selectedRoom.roomType._id,
//     checkInDate: checkIn.toISOString(),
//     checkOutDate: checkOut.toISOString(),
//     guests: guests
  
//   };
//   console.log("Booking Payload:", payload); // ✅ check this in browser console

//     try {
//       const res = await fetch('http://localhost:3000/api/bookings', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
          
//         },
//         body: JSON.stringify({
//           userId: user.id,
//           roomTypeId: selectedRoom.roomType._id,
//           checkInDate: checkIn.toISOString(),
//           checkOutDate: checkOut.toISOString(),
//           guests: guests,
          
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Booking failed');

//       toast({
//         title: "Booking Confirmed!",
//         description: `Your room has been booked successfully`,
//         duration: 5000,
//       });
//       // Delay navigation by 3 seconds (3000 ms)
// setTimeout(() => {
//   navigate('/guest-dashboard');
// }, 5000);
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//         duration: 5000,
//       });
//       // Delay navigation by 3 seconds (3000 ms)
// setTimeout(() => {
//   navigate('/guest-dashboard');
// }, 5000);
//     }
//   };


const handleBooking = async (payload) => {
  if (!payload || !payload.roomTypeId) {
    toast({
      title: "No Room Selected",
      description: "Please select a room to book",
      variant: "destructive",
      duration: 3000,
    });
    return;
  }

  console.log("Booking Payload:", payload); // ✅ check this in browser console

  try {
    const res = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Booking failed");

    toast({
      title: "Booking Confirmed!",
      description: "Your room has been booked successfully",
      duration: 5000,
    });

    setTimeout(() => {
      navigate("/guest-dashboard");
    }, 5000);
  } catch (error) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
      duration: 5000,
    });

    setTimeout(() => {
      navigate("/guest-dashboard");
    }, 5000);
  }
};

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/guest-dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Bed className="h-8 w-8 text-amber-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                  Book Your Stay
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showBookingForm ? (
          <>
            {/* Search Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Room</h2>
              
              {/* Date Selection */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="grid md:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label>Check-in Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkIn}
                          onSelect={setCheckIn}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkOut}
                          onSelect={setCheckOut}
                          disabled={(date) => date <= checkIn || date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label>Guests</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={checkAvailability}
                    disabled={loadingRooms}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loadingRooms ? 'Searching...' : 'Check Availability'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Available Rooms */}
            {availableRooms.length === 0 && !loadingRooms && (
              <p className="text-center text-gray-600 mt-6">No rooms available for selected dates.</p>
            )}

            {/* Room Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {availableRooms.map((room) => {
                
                
                return (
                  <Card key={room.roomType._id} className={`shadow-xl border-0 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                    
                    
                    
                    <div className="grid md:grid-cols-2">
                      <div className="relative h-64">
                        <img 
                          src={room.roomType.images[0]} 
                          alt={room.roomType.roomTypeName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/90 text-gray-900 shadow-lg">
                            <Star className="h-3 w-3 mr-1 text-amber-500 fill-current" />
                            {/*room.roomType.rating*/}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-xl mb-2">{room.roomType.roomTypeName}</CardTitle>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Up to {room.roomType.maxOccupancy.adults} guests</span>
                          </div>
                        </CardHeader>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {room.roomType.amenities.map((amenity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                            {/* {room.roomType.amenities.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{room.amenities.length - 4} more
                              </Badge>
                            )} */}
                          </div>
                        </div>

                        
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-3xl font-bold text-green-600">${room.roomType.pricePerNight}</span>
                            <span className="text-gray-600">/night</span>
                          </div>
                          <Button 
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowBookingForm(true);
                            }}
                            
                            className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Select Room
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          /* Booking Form */
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Complete Your Booking</CardTitle>
                <CardDescription className="text-center">
                  You're booking {selectedRoom?.roomType.roomTypeName} 
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Booking Summary */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Check-in:</span>
                      <span>{checkIn ? format(checkIn, "PPP") : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Check-out:</span>
                      <span>{checkOut ? format(checkOut, "PPP") : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span>{guests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Room Rate:</span>
                      <span>${selectedRoom?.roomType.pricePerNight}/night</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">${selectedRoom?.totalPrice}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Nights:</span>
                      <span className="text-green-600">${selectedRoom?.totalNights}</span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <Label htmlFor="requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="requests"
                    placeholder="Any special requirements or requests..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1"
                  >
                    Back to Rooms
                  </Button>
                  <Button 
                    onClick={() => {  navigate("/payment", {
  state: {
    amount: selectedRoom.totalPrice * 100, // in cents
    type: "booking",
    payload: {
      userId: user.id,
      roomTypeId: selectedRoom.roomType._id,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      guests,
    },
    title: "Room Booking Payment",
  },
});

  }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;