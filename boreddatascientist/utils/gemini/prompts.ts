/**
 * Prompt for generating a random scenario
 */
export function generateScenarioPrompt(): string {
    return `
      Generate a short, engaging survival scenario in one single sentence. The scenario should be challenging and interesting, with no more than 150 words, and should not contain any markdown, formatting, or additional details.
    `;
  }
  
  /**
   * Prompt for evaluating the user's answer
   * @param userAnswer The user's response to the scenario
   */
  export function evaluateAnswerPrompt(scenarioText: string, userAnswer: string): string {
    return `
      You are a survival expert in a life-or-death situation. Here is the scenario: "${scenarioText}". User's Answer: "${userAnswer}". Evaluate the answer and decide whether the person survives or dies. Provide a detailed explanation of why the answer leads to survival or death. Do not use markdown syntax, and ensure the explanation is written in a single paragraph with proper punctuation and no line breaks.
    `;
  }
  