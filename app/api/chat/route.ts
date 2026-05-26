import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion =
      await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
      });

    const reply =
      completion.choices[0]?.message?.content ||
      "No response.";

    return Response.json({
      reply,
    });
  } catch (error) {
    console.log("FULL GROQ ERROR:", error);

    return Response.json({
      reply:
        "⚠️ MAVRYAN systems encountered an error.",
    });
  }
}