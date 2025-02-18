// app/api/submit-answer/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { evaluateAnswer } from "@/utils/gemini/index"; // Assuming this function exists

export async function POST(req: NextRequest) {
  const { username, scenarioId, answer } = await req.json();

  if (!username || !scenarioId || !answer) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 1. Fetch the exact scenario text from the database using the scenarioId
  const supabase = await createClient();
  const { data: scenarioData, error: scenarioError } = await supabase
    .from("scenarios")
    .select("scenario")
    .eq("id", scenarioId)
    .single(); // Get the exact scenario text

  if (scenarioError) {
    return NextResponse.json({ error: "Failed to fetch scenario" }, { status: 500 });
  }

  // 2. Use the exact scenario text for the evaluation
  let evaluation;
  try {
    evaluation = await evaluateAnswer(scenarioData.scenario, answer); // Pass the exact scenario text to evaluate
  } catch (error) {
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }

  // 3. Insert the result into the database
  const { error: insertError } = await supabase.from("user_answers").insert([
    {
      username,
      scenario_id: scenarioId,
      answer,
      explanation: evaluation
    },
  ]);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Answer submitted successfully",
    evaluation
    });
}
