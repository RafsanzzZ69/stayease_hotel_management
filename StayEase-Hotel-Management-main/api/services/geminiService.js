// // services/geminiService.js
// import { GoogleGenerativeAI } from "@google/generative-ai";

// /**
//  * Safely parse JSON even if AI wraps it in code fences
//  */
// function safeParseJson(text) {
//   try {
//     const cleaned = text
//       .trim()
//       .replace(/^```json\s*/i, "")
//       .replace(/^```\s*/i, "")
//       .replace(/```$/i, "");
//     return JSON.parse(cleaned);
//   } catch (e) {
//     const err = new Error("Gemini returned non-JSON response");
//     err.raw = text;
//     throw err;
//   }
// }

// /**
//  * Ask Gemini to rank/suggest rooms.
//  * @param {Object} params
//  * @param {string} params.preferences - guest preferences in natural language
//  * @param {Array<Object>} params.availableRooms - rooms from DB (type, price, amenities, capacity, view, etc.)
//  * @returns {Promise<{suggestions: Array, reasoning: string}>}
//  */
// export async function suggestRooms({ preferences, availableRooms }) {
//   if (!preferences || !availableRooms) {
//     throw new Error("suggestRooms requires { preferences, availableRooms }");
//   }

//   const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
//   if (!API_KEY) {
//     throw new Error("Missing GOOGLE_GEMINI_API_KEY in environment variables");
//   }

//   const genAI = new GoogleGenerativeAI(API_KEY);

//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash-latest", // flash is sufficient for natural language + structured data
//     generationConfig: {
//       temperature: 0.2,
//       responseMimeType: "application/json", // enforce JSON output
//       maxOutputTokens: 1024,
//     },
//   });

//   const prompt = `
// You are a hotel room recommendation engine. You will receive:
// 1) Guest preferences as natural language text.
// 2) A list of available rooms from the database in structured JSON.

// Return only valid JSON in this shape:

// {
//   "suggestions": [
//     {
//       "roomType": "string",
//       "matchScore": 0-100,
//       "pricePerNight": number,
//       "reasons": ["short bullet", "short bullet"],
//       "upsell": "optional short suggestion or empty string"
//     }
//   ],
//   "reasoning": "1-2 sentence overall rationale"
// }

// Scoring guidance:
// - Penalize rooms that exceed budget; small overruns ok if strong match.
// - Capacity must meet or exceed guest count.
// - Consider price, capacity, bed type, view, amenities (wifi, breakfast, kitchen), availability dates.

// Input:
// "preferences": ${JSON.stringify(preferences)}
// "availableRooms": ${JSON.stringify(availableRooms)}
// `.trim();

//   try {
//     const result = await model.generateContent(prompt);
//     const text = result?.response?.text() ?? "";
//     const json = safeParseJson(text);

//     // Minimal validation & sanitize
//     if (!json || !Array.isArray(json.suggestions)) {
//       throw new Error("Gemini JSON missing 'suggestions' array");
//     }

//     json.suggestions = (json.suggestions || []).map((s) => ({
//       roomType: String(s.roomType ?? ""),
//       matchScore: Math.max(0, Math.min(100, Number(s.matchScore ?? 0))),
//       pricePerNight: Number(s.pricePerNight ?? 0),
//       reasons: Array.isArray(s.reasons) ? s.reasons.slice(0, 5).map(String) : [],
//       upsell: typeof s.upsell === "string" ? s.upsell : "",
//     }));

//     return {
//       suggestions: json.suggestions,
//       reasoning: typeof json.reasoning === "string" ? json.reasoning : "",
//     };
//   } catch (err) {
//     console.error("[Gemini] suggestion error:", err.message, err.raw ? `\nRaw:\n${err.raw}` : "");
//     throw new Error("Failed to generate room suggestions");
//   }
// }







// geminiService.js
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function suggestRooms({ preferences, availableRooms }) {
  if (!preferences || !availableRooms) {
    throw new Error("suggestRooms requires { preferences, availableRooms }");
  }

  try {
    const model = "gemini-2.5-flash";

//     const prompt = `
// You are a hotel room recommendation engine.

// USER PREFERENCES:
// ${JSON.stringify(preferences, null, 2)}

// AVAILABLE ROOMS:
// ${JSON.stringify(availableRooms, null, 2)}

// TASK:
// 1. Analyze user preferences (budget, bed type, guests, amenities).
// 2. From the available rooms, choose the most suitable ones.
// 3. Respond ONLY in JSON format with the structure below:
// {
//   "recommendedRooms": [
//     {
//       "roomId": "",
//       "reason": ""
//     }
//   ]
// }

// DO NOT include extra text, explanations, or markdown. ONLY JSON.
// `;

const prompt = `
You are a hotel room recommendation engine. You will receive:
1) Guest preferences as structured JSON
2) A list of available rooms as structured JSON

Your job:
- Score each room from 0–100 based on how well it matches the user's preferences.
-Consider price, capacity, bed type, view, amenities (wifi, breakfast, kitchen).
- Sort rooms by score (highest first).
- Give a final reasoning explaining why the top room is the best match.

Return ONLY valid JSON in EXACTLY this format:

{
  "suggestions": [
    {
      "roomType": "string",
      "matchScore": 0,
    }
  ],
  "reasoning": "short explanation why the top room is the best match"
}

Important:
- No markdown
- No backticks
- No extra text outside JSON
- matchScore must be 0–100
- roomType must match availableRooms[*].roomType exactly
- reasoning must be a single string

User Input:
"preferences": ${JSON.stringify(preferences)}
"availableRooms": ${JSON.stringify(availableRooms)}
`.trim();


    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      generationConfig: { temperature: 0.2 }
    });

    // Model may return text or streaming text
    const raw = response.text;
    
    // Parse JSON safely
    const cleaned = raw.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);

  } catch (err) {
    console.error("Gemini suggestRooms Error:", err.message);
    throw new Error("Failed to generate room suggestions");
  }
}

