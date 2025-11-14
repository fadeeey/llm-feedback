import { GoogleGenAI, Type } from "@google/genai";
import type { AIReport } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("The process.env.API_KEY environment variable is not set. Please set it to your Google Gemini API key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
    },
    required: ['bullets', 'strengths', 'improvements', 'recommendations', 'rubric', 'summary']
};

const systemInstruction = `
Вы — опытный HR-аналитик. Ваша задача — проанализировать следующие анонимные отзывы сотрудников и составить структурированный, объективный и конструктивный отчет о производительности.

Правила:
1.  Тщательно проанализируйте все отзывы.
2.  Синтезируйте информацию в соответствии с предоставленной схемой JSON.
3.  Оценки в рубрике должны быть в диапазоне от 0.0 до 10.0.
4.  Все текстовые поля должны быть написаны профессионально и грамотно.
`;


export const generateReport = async (feedbackList: string[]): Promise<AIReport> => {
  const userPrompt = `
    Отзывы для анализа:
    ${feedbackList.map((feedback, index) => ` - Отзыв ${index + 1}: "${feedback}"`).join('\n')}

    Теперь, пожалуйста, создайте отчет на основе этих отзывов.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        temperature: 0.2, // Lower temperature for more deterministic, factual output
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("Получен пустой ответ от API. Возможно, модель не смогла сгенерировать отчет на основе предоставленных отзывов.");
    }

    const parsedReport = JSON.parse(jsonText);
    const completeReport: AIReport = {
      ...parsedReport,
      generated_at: new Date().toISOString(),
    };
    
    return completeReport;

  } catch (error) {
    console.error("Error generating report with Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Предоставленный ключ API Gemini недействителен. Пожалуйста, проверьте переменные окружения.");
        }
        if (error.message.includes("429")) {
            throw new Error("Превышен лимит запросов к API. Пожалуйста, подождите немного и попробуйте снова.");
        }
    }
    throw new Error("Произошла непредвиденная ошибка при создании AI-отчета. Пожалуйста, проверьте консоль для получения подробной информации.");
  }
};