// // src/pages/UserDrawer.jsx
// import { X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useEffect } from "react";

// const UserDrawer = ({ open, onClose, user, onSave, onDelete }) => {
//   if (!user) return null;

//   const [formData, setFormData] = useState({
//     department: "",
//     departmentRole: "",
//     floorNumber: "",
//     salary: "",
//   });

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         department: user.department || "",
//         departmentRole: user.departmentRole || "",
//         floorNumber: user.floorNumber || "",
//         salary: user.salary || "",
//       });
//     }
//   }, [user]);

//   return (
//     <AnimatePresence>
//       {open && (
//         <div className="fixed inset-0 z-50 flex">
//           {/* Overlay */}
//           <motion.div
//             className="fixed inset-0 bg-black/30"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//           />

//           {/* Drawer */}
//           <motion.div
//             className="ml-auto w-full max-w-md bg-white shadow-xl h-full flex flex-col"
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "spring", stiffness: 200, damping: 25 }}
//             onClick={(e) => e.stopPropagation()} // <--- Add this
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b">
//               <h2 className="text-lg font-semibold">Edit User</h2>
//               <button
//                 onClick={onClose}
//                 className="p-2 rounded-full hover:bg-gray-100"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>

//             {/* Content */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {/* Read-only fields */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Name
//                 </label>
//                 <input
//                   type="text"
//                   value={user.name}
//                   readOnly
//                   className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   type="text"
//                   value={user.email}
//                   readOnly
//                   className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Phone
//                 </label>
//                 <input
//                   type="text"
//                   value={user.number}
//                   readOnly
//                   className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed"
//                 />
//               </div>

//               {/* Editable fields */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Department
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.department}
//                   onChange={(e) =>
//                     setFormData({ ...formData, department: e.target.value })
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Role
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.departmentRole}
//                   onChange={(e) =>
//                     setFormData({ ...formData, departmentRole: e.target.value })
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Floor
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.floorNumber}
//                   onChange={(e) =>
//                     setFormData({ ...formData, floorNumber: e.target.value })
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Salary
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.salary}
//                   onChange={(e) =>
//                     setFormData({ ...formData, salary: e.target.value })
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm"
//                 />
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="p-4 border-t flex justify-between">
//               <button
//                 onClick={onDelete}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => onSave({ ...user, ...formData })}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default UserDrawer;



import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from './ui/button';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";

const UserDrawer = ({ open, onClose, user, onSave, onDelete }) => {
  if (!user) return null;

  const [formData, setFormData] = useState({
    department: "",
    departmentRole: "",
    floorNumber: "",
    salary: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        department: user.department || "",
        departmentRole: user.departmentRole || "",
        floorNumber: user.floorNumber || "",
        salary: user.salary || "",
      });
    }
  }, [user]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Enhanced Overlay with blur effect */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Enhanced Drawer */}
          <motion.div
            className="ml-auto w-full max-w-lg bg-white shadow-2xl h-full flex flex-col relative"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
                <p className="text-sm text-gray-500 mt-1">Update user information</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Enhanced Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* User Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-1 w-8 bg-gray-300 rounded-full"></div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      User Information
                    </h3>
                  </div>

                  {/* Read-only fields with enhanced styling */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={user.name}
                        readOnly
                        className={cn(
                          "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed",
                          "focus:ring-0 focus:border-gray-200 transition-all duration-200"
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        readOnly
                        className={cn(
                          "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed",
                          "focus:ring-0 focus:border-gray-200 transition-all duration-200"
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={user.number}
                        readOnly
                        className={cn(
                          "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed",
                          "focus:ring-0 focus:border-gray-200 transition-all duration-200"
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        Account Type
                      </Label>
                      <Input
                        id="account type"
                        type="text"
                        value={user.accountType}
                        readOnly
                        className={cn(
                          "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed",
                          "focus:ring-0 focus:border-gray-200 transition-all duration-200"
                        )}
                      />
                    </div>
                    


                  </div>
                </div>

                {/* Department Info Section */}
                {user.accountType === "staff" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="h-1 w-8 bg-blue-400 rounded-full"></div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Department Information
                    </h3>
                  </div>

                  {/* Editable fields with enhanced styling */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-gray-700 font-medium">
                        Department
                      </Label>
                      <Input
                        id="department"
                        type="text"
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({ ...formData, department: e.target.value })
                        }
                        placeholder="Enter department name"
                        className={cn(
                          "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                          "transition-all duration-200 hover:border-gray-400"
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-700 font-medium">
                        Department Role
                      </Label>
                      <Input
                        id="role"
                        type="text"
                        value={formData.departmentRole}
                        onChange={(e) =>
                          setFormData({ ...formData, departmentRole: e.target.value })
                        }
                        placeholder="Enter role/position"
                        className={cn(
                          "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                          "transition-all duration-200 hover:border-gray-400"
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="floor" className="text-gray-700 font-medium">
                          Floor Number
                        </Label>
                        <Input
                          id="floor"
                          type="number"
                          value={formData.floorNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, floorNumber: e.target.value })
                          }
                          placeholder="Floor"
                          className={cn(
                            "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                            "transition-all duration-200 hover:border-gray-400"
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salary" className="text-gray-700 font-medium">
                          Salary ($)
                        </Label>
                        <Input
                          id="salary"
                          type="number"
                          value={formData.salary}
                          onChange={(e) =>
                            setFormData({ ...formData, salary: e.target.value })
                          }
                          placeholder="0.00"
                          className={cn(
                            "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                            "transition-all duration-200 hover:border-gray-400"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div> )}
              </div>
            </div>

            {/* Enhanced Footer */}
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50">
              <div className="flex justify-between space-x-4">
                <Button
                  onClick={onDelete}
                  variant="destructive"
                  className={cn(
                    "bg-red-500 hover:bg-red-600 text-white shadow-md",
                    "transition-all duration-200 transform hover:scale-105",
                    "focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  )}
                >
                  Delete User
                </Button>
                
                <Button
                  onClick={() => onSave({ ...user, ...formData })}
                  className={cn(
                    "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
                    "transition-all duration-200 transform hover:scale-105",
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  )}
                >
                  Save Changes
                </Button> 
              </div>
            </div>

            {/* Decorative border */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-blue-600"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDrawer;
