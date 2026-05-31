export async function sendChatRequest(
  messages: {
    role: string;
    content: string;
  }[],
  webSearch: boolean
) {
  const response = await fetch(
    "/api/chat",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        messages,
        webSearch,
      }),
    }
  );

  return response.json();
}
