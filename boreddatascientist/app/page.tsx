// app/page.tsx (✅ Server Component)
import { createClient } from "@/utils/supabase/server";
import { generateScenario } from "@/utils/gemini/index";
import UserInputForm from "@/components/UserInputForm"; // New Client Component

export default async function Home() {
  const supabase = await createClient();

  // ✅ Check if a scenario exists for today
  const { data: existingScenario } = await supabase
    .from("scenarios")
    .select("id, scenario")
    .eq("created_at_date", new Date().toISOString().split("T")[0])
    .single();

  let scenarioId = existingScenario?.id;
  let scenarioText = existingScenario?.scenario;

  // ✅ If no scenario exists, generate a new one
  if (!scenarioText) {
    try {
      scenarioText = await generateScenario();

      const { data, error } = await supabase
        .from("scenarios")
        .insert([{ scenario: scenarioText, created_at_date: new Date().toISOString().split("T")[0] }])
        .select("id")
        .single();

      if (error) {
        console.error("Failed to insert scenario:", error.message);
      } else {
        scenarioId = data.id;
      }
    } catch (error) {
      console.error("Failed to generate scenario:", error instanceof Error ? error.message : "Unknown error");
    }
  }

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-3xl font-semibold text-center mb-4">Scenario of the Day</h1>
      <p className="text-lg text-center">
        {scenarioText || "Failed to load scenario. Please try again later."}
      </p>

      {scenarioId && <UserInputForm scenarioId={scenarioId} />}
    </div>
  );
}
