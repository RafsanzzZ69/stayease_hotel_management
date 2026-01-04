// Mock data for StayEase Hotel Management System

export const mockUsers = [
  {
    id: '1',
    email: 'guest@stayease.com',
    password: 'password123',
    role: 'guest',
    name: 'John Doe',
    phone: '+1-234-567-8900',
    preferences: ['wifi', 'ac', 'breakfast']
  },
  {
    id: '2',
    email: 'staff@stayease.com',
    password: 'password123',
    role: 'staff',
    name: 'Sarah Smith',
    department: 'housekeeping'
  },
  {
    id: '3',
    email: 'admin@stayease.com',
    password: 'password123',
    role: 'admin',
    name: 'Michael Johnson'
  }
];

export const mockRooms = [
  {
    id: 'r1',
    number: '101',
    type: 'Deluxe Suite',
    price: 299,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Ocean View'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
    ],
    available: true,
    floor: 1,
    rating: 4.8
  },
  {
    id: 'r2',
    number: '205',
    type: 'Standard Room',
    price: 159,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop'
    ],
    available: true,
    floor: 2,
    rating: 4.5
  },
  {
    id: 'r3',
    number: '301',
    type: 'Presidential Suite',
    price: 599,
    capacity: 4,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Room Service'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop'
    ],
    available: false,
    floor: 3,
    rating: 5.0
  }
];

export const mockBookings = [
  {
    id: 'b1',
    guestId: '1',
    roomId: 'r1',
    checkIn: '2025-01-20',
    checkOut: '2025-01-25',
    totalAmount: 1495,
    status: 'confirmed',
    guests: 2,
    specialRequests: 'Late checkout requested'
  }
];

export const mockServices = [
  {
    id: 's1',
    name: 'Room Service',
    category: 'food',
    items: [
      { id: 'f1', name: 'Club Sandwich', price: 18, image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop' },
      { id: 'f2', name: 'Caesar Salad', price: 15, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
      { id: 'f3', name: 'Pasta Carbonara', price: 22, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop' }
    ]
  },
  {
    id: 's2',
    name: 'Housekeeping',
    category: 'cleaning',
    items: [
      { id: 'h1', name: 'Extra Towels', price: 0 },
      { id: 'h2', name: 'Room Cleaning', price: 25 },
      { id: 'h3', name: 'Laundry Service', price: 15 }
    ]
  }
];

export const mockOrders = [
  {
    id: 'o1',
    guestId: '1',
    roomNumber: '101',
    items: [
      { name: 'Club Sandwich', quantity: 1, price: 18 },
      { name: 'Coffee', quantity: 2, price: 8 }
    ],
    total: 26,
    status: 'preparing',
    orderTime: '2025-01-15T14:30:00Z',
    estimatedDelivery: '2025-01-15T15:00:00Z'
  }
];

export const mockNotifications = [
  {
    id: 'n1',
    userId: '1',
    title: 'Booking Confirmed',
    message: 'Your booking for Deluxe Suite has been confirmed.',
    type: 'success',
    timestamp: '2025-01-15T10:00:00Z',
    read: false
  },
  {
    id: 'n2',
    userId: '1',
    title: 'Check-in Reminder',
    message: 'Your check-in is tomorrow at 3:00 PM.',
    type: 'info',
    timestamp: '2025-01-14T16:00:00Z',
    read: true
  }
];

export const mockFeedback = [
  {
    id: 'fb1',
    guestId: '1',
    roomId: 'r1',
    rating: 5,
    comment: 'Excellent service and beautiful room!',
    category: 'room',
    timestamp: '2025-01-10T12:00:00Z'
  }
];

export const mockAnalytics = {
  occupancyRate: 78,
  totalBookings: 245,
  revenue: 125000,
  averageRating: 4.6,
  peakHours: [
    { hour: '14:00', bookings: 15 },
    { hour: '15:00', bookings: 22 },
    { hour: '16:00', bookings: 18 }
  ],
  roomTypeBookings: [
    { type: 'Standard', count: 120 },
    { type: 'Deluxe', count: 89 },
    { type: 'Suite', count: 36 }
  ]
};

// Auth helper functions
export const authenticateUser = (email, password) => {
  return mockUsers.find(user => user.email === email && user.password === password);
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('stayease_user');
  return userData ? JSON.parse(userData) : null;
};

export const loginUser = (user) => {
  localStorage.setItem('stayease_user', JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem('stayease_user');
};