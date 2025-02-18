/**
 * Prompt for generating a random scenario
 */
export function generateScenarioPrompt(): string {
    return `
      Generate a random scenario for a survival situation. The scenario should be engaging but challenging.
    `;
  }
  
  /**
   * Prompt for evaluating the user's answer
   * @param userAnswer The user's response to the scenario
   */
  export function evaluateAnswerPrompt(userAnswer: string): string {
    return `
      Evaluate this answer to a survival scenario: "${userAnswer}". Decide whether the person survives or dies based on the answer.
    `;
  }
  