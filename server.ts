import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI server-side with strict fallback safeguards
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

app.use(express.json());

// API health and configuration check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    time: new Date().toISOString(),
    aiEngine: ai ? "active (Gemini 3.5)" : "backup offline-concierge active"
  });
});

// Secure server-side AI travel concierge proxy endpoint
app.post("/api/assistant", async (req, res) => {
  const { messages, userPreferences } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages history array is required." });
  }

  // Elegant fallback response if GEMINI_API_KEY is not configured
  if (!ai) {
    return res.json({
      role: "assistant",
      content: `Thank you for contacting the elite **Aura Resorts Concierge**. 

*Our advanced neural travel assistant is operating in Backup Hospitality Mode (API key not configured).*

Here is a curated royal recommendation based on your inquiry:

* 🏛️ **Heritage & Renaissance**: Seek our majestic **Palazzo Sforza Relais** in *Rome*, complete with 16th-century architectural ceiling frescoes.
* 🌸 **Zen Reflection**: Retreat to our cedar onsen-heated **Teahouse Kyomachi Kyoto** in *Tokyo* for peaceful garden alignment.
* 🗼 **Parisian Romance**: Select our **Le Lumière Palace** for grand terraces looking directly onto the Eiffel Tower.
* 🌆 **Skylark Horizon**: Book the spectacular heights at **The Manhattan Grand** in *New York City*.

May I assist you in verifying our availability or suite features for these venues?`
    });
  }

  try {
    const lastMessage = messages[messages.length - 1]?.content || "Hello";

    const promptContext = `
      You are the Elite Royal Concierge at "AURA Resorts & Residences", a world-wide ultra-luxury five-star hotel platform.
      Always respond with exquisite grace, supreme hospitality, and sophisticated formatting.
      You have access to the following 5 signature properties in our active catalog:
      
      1. Le Lumière Palace (Paris, France) - Rating: 4.9. Average price: $280-$850 USD. Highlights: Champs-Élysées luxury, Michelin dining, balconies looking directly at the Eiffel Tower, Imperial Penthouse with private butler.
      2. The Manhattan Grand (New York, USA) - Rating: 4.8. Average price: $195-$450 USD. Highlights: Midtown high-rise near Central Park, floor-to-ceiling skyview lounge overlooking Central Park, high-density sleek design.
      3. Palazzo Sforza Relais (Rome, Italy) - Rating: 4.7. Average price: $160-$240 USD. Highlights: Masterfully preserved 16th-century Renaissance palace, authentic ceiling frescoes, lemon-scented breakfast courtyard, Pantheon neighborhood tours.
      4. Teahouse Kyomachi Kyoto (Tokyo/Kyoto, Japan) - Rating: 4.95. Average price: $290-$510 USD. Highlights: Authentic ryokan styled Gion Gaku elements, fragrance of Igusa tatami mats, private outdoor Hinoki cedar hot springs onsens, traditional breakfast.
      5. The King’s Chelsea Court (London, UK) - Rating: 4.6. Average price: $175-$380 USD. Highlights: Majestic red-brick Victorian Chelsea mansion, authentic afternoon tea gardens, reading rooms stocked with leather Chesterfield fires.
      
      Core Guidance Rules:
      - Always refer to properties and cities with elegance. Highlight the cultural vibe and room features.
      - Recommend the correct hotel depending on the guest's desire (e.g. Zen/relaxation -> Kyoto/TokyoRyokan; Romance/culinary -> Paris; Grand culture/ancient -> Rome; High society shopping -> London; Dynamic sky urban views -> NYC).
      - Advise them elegantly on specific room types (Deluxe, Suites, Penthouse, Family Lofts).
      - Maintain standard high-end formatting: markdown paragraphs, subtle lists, bold accents, and stylish separation. Keep answers brief (typically 2-3 short, beautifully written paragraphs) so they fit nicely in a chat utility widget.
    `;

    // Fire the Gemini 3.5 Flash query
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: lastMessage,
      config: {
        systemInstruction: promptContext,
        temperature: 0.75,
      }
    });

    res.json({
      role: "assistant",
      content: response.text || "I apologize, but our concierge line is currently experiencing deep focus. High luxury stays are awaiting you; which suite shall we explore?"
    });
  } catch (error: any) {
    console.error("Gemini API server exception:", error);
    res.status(500).json({ error: error.message || "Concierge AI service is momentarily restyling." });
  }
});

// Boot the Express web server using development or production flow
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury Express + Vite server operating securely at http://localhost:${PORT}`);
  });
}

startServer();
