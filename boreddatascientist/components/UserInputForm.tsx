// components/UserInputForm.tsx (Client Component)
"use client"; // Mark as client-side component

import React, { useState } from "react";

interface UserInputFormProps {
  scenarioId: number;
  scenarioText: string;
}

const UserInputForm: React.FC<UserInputFormProps> = ({ scenarioId, scenarioText }) => {
  const [username, setUsername] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<string | null>(null); // To store the evaluation result
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && answer) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/submit-answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            scenarioId,
            answer,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Display the evaluation from Gemini API
          setEvaluation(data.evaluation); // Show the explanation from Gemini API
        } else {
          setError(data.error || "Failed to submit answer");
        }
      } catch (error) {
        setError("An error occurred while submitting the answer.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mt-4">
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Your Answer:</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
          required
        />
      </div>

      <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">
        Submit Answer
      </button>

      {loading && <p className="text-center mt-4">Evaluating your answer...</p>}

      {evaluation && (
        <div className="evaluation-result mt-6">
          <h2 className="text-xl font-semibold">Evaluation:</h2>
          <div
            className="evaluation-text mt-2"
            dangerouslySetInnerHTML={{ __html: evaluation }} // To render formatted HTML (like new lines)
          />
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
};

export default UserInputForm;
