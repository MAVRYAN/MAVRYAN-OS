export function extractResponseText(
  data: any
): string {
  if (typeof data === "string") {
    return data;
  }

  if (data.content) {
    return data.content;
  }

  if (data.message) {
    return data.message;
  }

  return JSON.stringify(
    data,
    null,
    2
  );
}
