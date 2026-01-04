// controllers/aiRoomMergeController.js
import RoomType from "../models/roomtype.js"; // adjust path if needed

export const enrichRoomSuggestions = async (req, res) => {
  try {
    const { suggestions, reasoning } = req.body;

    if (!Array.isArray(suggestions) || !reasoning) {
      return res.status(400).json({
        success: false,
        message: "Body must include { suggestions: [], reasoning: string }",
      });
    }

    // Fetch room types in parallel
    const enriched = await Promise.all(
      suggestions.map(async (s) => {
        const roomType = await RoomType.findOne({ roomTypeName: s.roomType });

        if (!roomType) {
          return {
            roomType: s.roomType, // fallback if not found in DB
            matchScore: s.matchScore,
            reasons: s.reasons,
            upsell: s.upsell,
            reasoning,
            notFound: true, // to flag missing rooms
          };
        }

        return {
          roomType,
          matchScore: s.matchScore,
          // reasons: s.reasons,
          // upsell: s.upsell,
          reasoning,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (err) {
    console.error("Error enriching room suggestions:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
