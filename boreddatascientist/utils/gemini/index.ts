import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateScenarioPrompt, evaluateAnswerPrompt } from "@/utils/gemini/prompts";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Function to generate a random scenario using Gemini
 */
export async function generateScenario(): Promise<string> {
  try {
    const prompt = generateScenarioPrompt();
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating scenario:", error);
    throw new Error("Failed to generate scenario");
  }
}

/**
 * Function to evaluate the user's answer using Gemini
 * @param userAnswer The user's answer to the scenario
 * @returns Evaluation response (survived or died)
 */
export async function evaluateAnswer(userAnswer: string): Promise<string> {
  try {
    const prompt = evaluateAnswerPrompt(userAnswer);
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error evaluating answer:", error);
    throw new Error("Failed to evaluate answer");
  }
}
