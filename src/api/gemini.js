import { GoogleGenerativeAI } from "@google/generative-ai";
import { TavilyClient } from "tavily-search-client";

const geminiApiKey = process.env.GOOGLE_API_KEY;
const tavilyApiKey = process.env.TAVILY_API_KEY;

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const tavily = new TavilyClient({ apiKey: tavilyApiKey });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, useWebSearch } = req.body;

  let augmentedPrompt = prompt;
  if (useWebSearch) {
    try {
      const searchResults = await tavily.search(prompt); // basic search
      augmentedPrompt = `Based on the following web search results: ${searchResults.results.map(r => r.content).join('\n')}\n\nOriginal Query: ${prompt}`;
    } catch (error) {
      console.error("Tavily Search Error:", error);
      return res.status(500).json({ error: 'Error during web search' });
    }
  }

  try {
    const result = await model.generateContent(augmentedPrompt);
    const response = await result.response;
    const text = response.text();
    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: 'Error generating content' });
  }
}