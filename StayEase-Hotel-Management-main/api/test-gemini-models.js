import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';



// async function testGemini() {
// const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
// if (!apiKey) throw new Error("Missing GOOGLE_GEMINI_API_KEY");

// console.log("Using API Key:", process.env.GOOGLE_GEMINI_API_KEY);


// const ai = new GoogleGenAI({ apiKey });

// try {
// const response = await ai.models.generateContent({
// model: "gemini-3-pro-preview",
// contents: "Say 'Hello from Gemini!' in JSON format like {\"message\" :\"...\"}",
// });

// ```
// console.log("Raw Gemini output:", response.text());
// ```

// } catch (err) {
// console.error("Error calling Gemini model:", err);
// }
// }

// testGemini();




async function testGemini() {
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GOOGLE_GEMINI_API_KEY");

console.log("Using API Key:", apiKey);

const ai = new GoogleGenAI({ apiKey });

try {
const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
contents: "Explain how AI works in a few words",
});

console.log(response.text);

} catch (err) {
console.error("Error calling Gemini model:", err);
}
}

testGemini();


// async function listModels() {
//   const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
//   const models = await ai.models.list();
//   console.log("Available models:" , models);
  
// }

// listModels();
