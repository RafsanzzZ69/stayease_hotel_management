import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Bed, 
  Shield, 
  Smartphone, 
  Users, 
  Star, 
  Wifi, 
  Car, 
  Coffee,
  MapPin,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";
const HomePage = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: <Bed className="h-8 w-8 text-amber-600" />,
      title: "Online Room Booking",
      description: "Book rooms with real images, amenities, and floor plans"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-blue-600" />,
      title: "Digital Room Service",
      description: "Order food and amenities with live tracking"
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" />,
      title: "Smart Housekeeping",
      description: "Request cleaning and maintenance services digitally"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "AI Room Suggestions",
      description: "Get personalized room recommendations based on your preferences"
    }
  ];

  const roomTypes = [
    {
      name: "Standard Room",
      price: "$159",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
      amenities: ["WiFi", "AC", "TV"]
    },
    {
      name: "Deluxe Suite",
      price: "$299", 
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
      amenities: ["WiFi", "AC", "TV", "Mini Bar", "Ocean View"]
    },
    {
      name: "Presidential Suite",
      price: "$599",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop", 
      amenities: ["WiFi", "AC", "TV", "Mini Bar", "Jacuzzi", "Balcony"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bed className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
                StayEase
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Login 
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-60"></div>
          
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-amber-100 text-blue-800 border-blue-200">
            ✨ Smart Hotel Management System
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to
            <span className="block bg-gradient-to-r from-blue-600 to-amber-600 bg-clip-text text-transparent">
              StayEase
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the future of hospitality with our comprehensive hotel management platform. 
            From seamless bookings to AI-powered room suggestions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-amber-600 hover:from-blue-700 hover:to-amber-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg transition-all duration-300">
                Sign In 
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Perfect Stays
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive suite of features designed to enhance every aspect of your hotel experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-50 to-amber-50 rounded-xl w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Room Types Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Luxurious Accommodations
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our carefully curated selection of rooms and suites
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {roomTypes.map((room, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-48">
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-900 shadow-lg">
                      {room.price}/night
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    {room.name}
                    <Star className="h-5 w-5 text-amber-500 fill-current" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-amber-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Hotel Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied guests and hotel staff who trust StayEase for their hospitality needs
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bed className="h-6 w-6 text-amber-500" />
                <h3 className="text-xl font-bold">StayEase</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The future of hotel management, designed for modern hospitality.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  Room Booking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  Digital Services
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-500" />
                  AI Suggestions
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  hello@stayease.com
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  123 Hotel Avenue
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Amenities</h4>
              <div className="flex flex-wrap gap-3">
                <Wifi className="h-6 w-6 text-amber-500" />
                <Car className="h-6 w-6 text-amber-500" />
                <Coffee className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StayEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;