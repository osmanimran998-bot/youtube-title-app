import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type SEOSection = "titles" | "descriptions" | "hashtags" | "thumbnails";

export const generateSEOContent = async (section: SEOSection, context: string) => {
  const model = "gemini-3-flash-preview";
  
  const prompts: Record<SEOSection, string> = {
    titles: `Generate 5 viral, click-worthy, and SEO-optimized YouTube video titles based on this context: "${context}". Make them catchy but avoid misleading clickbait. Include a mix of search-based and curiosity-based titles.`,
    descriptions: `Write a high-converting, SEO-friendly YouTube video description for a video about: "${context}".
    Include:
    1. A hook in the first 2 lines.
    2. A detailed summary of the video.
    3. Placeholder for social media links.
    4. Call to action.
    Use professional but engaging tone.`,
    hashtags: `Generate 15 relevant and trending YouTube hashtags for a video about: "${context}". Categorize them into broad, niche, and video-specific hashtags.`,
    thumbnails: `Provide 3 creative and high-CTR thumbnail design concepts for a video about: "${context}". 
    Describe:
    1. The main imagery.
    2. Text overlays (font style/color).
    3. Color palette recommendations.
    4. Composition/layout ideas.`
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompts[section],
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Could not reach the AI service. Please check your internet or API configuration.";
  }
};
