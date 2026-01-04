// // controllers/aiController.js
// import { suggestRooms } from "../services/geminiService.js";
// import findAvailableRooms from "./aiAvailability.js";

// export const getRoomSuggestions = async (req, res) => {
//   try {
//     const { preferences,  checkInDate, checkOutDate  , guest} = req.body;

//     // Lightweight validation
//     if (!preferences || !checkInDate || !checkOutDate || !guest) {
//       return res.status(400).json({
//         success: false,
//         message: "Body must include { preferences, checkInDate, checkOutDate, guest }",
//       });
//     }

//   // available room types
//   const availableRooms = await findAvailableRooms({ checkInDate, checkOutDate, guest });

//     const result = await suggestRooms({ preferences, availableRooms });

//     return res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message || "Internal server error",
//     });
//   }
// };


// controllers/aiController.js
import { suggestRooms } from "../services/geminiService.js";
import findAvailableRooms from "./aiAvailability.js";

/**
 * Controller: Get AI-based room suggestions
 * Expects in req.body:
 * - preferences (string): guest preferences in natural language
 * - checkInDate, checkOutDate (string / ISO date)
 * - guest (object with number of guests, id, etc.)
 */
export const getRoomSuggestions = async (req, res) => {
  try {
    const { preferences, checkInDate, checkOutDate, guests } = req.body;

    // Validate required fields
    if (!preferences || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({
        success: false,
        message: "Body must include { preferences, checkInDate, checkOutDate, guests }",
      });
    }

    // Fetch available rooms for the requested dates & guest count
    const availableRooms = await findAvailableRooms({ checkInDate, checkOutDate, guests });

    if (!availableRooms || availableRooms.length === 0) {
      return res.status(200).json({
        success: true,
        data: { suggestions: [], reasoning: "No rooms available for the selected dates." },
      });
    }

    // Call Gemini AI to rank/suggest rooms based on natural text preferences
    const result = await suggestRooms({ preferences, availableRooms });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[AI Controller] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};





