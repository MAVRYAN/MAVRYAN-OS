export function generateSmartTitle(
  text: string
): string {
  let cleanText = text.trim();

  const fillers = [
    /^how do i /i,
    /^how to /i,
    /^what is /i,
    /^what are /i,
    /^tell me about /i,
    /^tell me /i,
    /^can you /i,
    /^could you /i,
    /^write a /i,
    /^write /i,
    /^create a /i,
    /^create /i,
    /^help me with /i,
    /^help me /i,
    /^explain /i,
    /^please /i,
    /^show me /i,
    /^give me /i,
    /^i need /i,
  ];

  for (const filler of fillers) {
    cleanText = cleanText.replace(
      filler,
      ""
    );
  }

  cleanText = cleanText
    .replace(/[?!.,;:_]+$/, "")
    .trim();

  if (cleanText.length > 35) {
    const truncated =
      cleanText.substring(0, 35);

    const lastSpace =
      truncated.lastIndexOf(" ");

    cleanText =
      lastSpace > 10
        ? truncated.substring(
            0,
            lastSpace
          )
        : truncated;
  }

  const title = cleanText
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");

  return title || "New Chat";
}
