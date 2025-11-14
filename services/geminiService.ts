
import { GoogleGenAI, Type } from "@google/genai";
import type { AIReport } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("Gemini API key not found. Using a placeholder. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'YOUR_API_KEY_HERE' });

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Three to five key summary bullet points of the overall feedback.'
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of specific, quoted, or summarized strengths mentioned in the feedback.'
        },
        improvements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of specific, quoted, or summarized areas for improvement mentioned in the feedback.'
        },
        recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of actionable recommendations for the employee to focus on.'
        },
        rubric: {
            type: Type.OBJECT,
            properties: {
                communication: { type: Type.NUMBER, description: 'A score from 0.0 to 10.0 for communication skills.' },
                deadlines: { type: Type.NUMBER, description: 'A score from 0.0 to 10.0 for meeting deadlines and time management.' },
                quality: { type: Type.NUMBER, description: 'A score from 0.0 to 10.0 for the quality of work.' },
                initiative: { type: Type.NUMBER, description: 'A score from 0.0 to 10.0 for proactivity and initiative.' },
            },
            required: ['communication', 'deadlines', 'quality', 'initiative']
        },
        summary: {
            type: Type.STRING,
            description: 'A concise, professional, one-paragraph summary of the feedback.'
        },
        generated_at: {
            type: Type.STRING,
            description: 'The ISO 8601 timestamp of when the report was generated.'
        },
    },
    required: ['bullets', 'strengths', 'improvements', 'recommendations', 'rubric', 'summary', 'generated_at']
};

export const generateReport = async (feedbackList: string[]): Promise<AIReport> => {
  const prompt = `
    As an expert HR analyst, your task is to analyze the following pieces of anonymous employee feedback and generate a structured, objective, and constructive performance report.

    Rules:
    1.  Analyze all feedback entries thoroughly.
    2.  Synthesize the information into the provided JSON schema.
    3.  Scores for the rubric must be between 0.0 and 10.0.
    4.  All text fields should be professional and well-written.
    5.  Set 'generated_at' to the current ISO 8601 timestamp.

    Feedback entries to analyze:
    ${feedbackList.map((feedback, index) => ` - Feedback ${index + 1}: "${feedback}"`).join('\n')}

    Now, generate the report based on this feedback.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.2, // Lower temperature for more deterministic, factual output
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the API.");
    }

    const parsedReport: AIReport = JSON.parse(jsonText);
    return parsedReport;

  } catch (error) {
    console.error("Error generating report with Gemini:", error);
    if (error instanceof Error && error.message.includes("429")) {
        throw new Error("API rate limit exceeded. Please wait and try again later.");
    }
    throw new Error("Failed to generate AI report. Please check the console for details.");
  }
};
