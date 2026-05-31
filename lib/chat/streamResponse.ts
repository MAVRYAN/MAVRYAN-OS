export async function streamResponse(
  text: string,
  onChunk: (
    currentText: string,
    isComplete: boolean
  ) => void
) {
  const chunkSize = 16;

  for (
    let i = chunkSize;
    i <= text.length + chunkSize;
    i += chunkSize
  ) {
    const nextIndex = Math.min(
      i,
      text.length
    );

    const currentText =
      text.slice(0, nextIndex);

    onChunk(
      currentText,
      nextIndex >= text.length
    );

    if (nextIndex < text.length) {
      await new Promise<void>(
        (resolve) => {
          requestAnimationFrame(() =>
            resolve()
          );
        }
      );
    }
  }
}
