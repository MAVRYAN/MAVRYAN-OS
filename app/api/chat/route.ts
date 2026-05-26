import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const latestMessage =
      messages[messages.length - 1].content;

    const chatCompletion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are MAVRYAN, a futuristic AI assistant. Be intelligent, confident, concise, and helpful. Speak naturally like an advanced AI system. Avoid roleplay, scene descriptions, and bracketed actions."
          },
          {
            role: "user",
            content: latestMessage,
          },
        ],

        model: "llama-3.3-70b-versatile",

        stream: true,
      });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for await (
          const chunk of chatCompletion
        ) {
          const text =
            chunk.choices[0]?.delta?.content ||
            "";

          controller.enqueue(
            encoder.encode(text)
          );
        }

        controller.close();
      },
    });

    return new Response(stream);

  } catch (error: any) {
    console.error(error);

    return new Response(
      JSON.stringify(error),
      {
        status: 500,
      }
    );
  }
}