import {
  useCallback,
  useEffect,
  useState,
} from "react";

export function useChatScroll(
  chatRef: React.RefObject<HTMLDivElement | null>,
  dependency: unknown
) {
  const [isNearBottom, setIsNearBottom] =
    useState(true);

  useEffect(() => {
    const container = chatRef.current;

    if (!container) return;

    const handleScroll = () => {
      const threshold = 150;

      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      setIsNearBottom(
        distanceFromBottom < threshold
      );
    };

    handleScroll();

    container.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      container.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [chatRef]);

  const scrollToBottom =
    useCallback(
      (smooth = true) => {
        if (
          chatRef.current &&
          isNearBottom
        ) {
          chatRef.current.scrollTo({
            top:
              chatRef.current.scrollHeight,
            behavior: smooth
              ? "smooth"
              : "auto",
          });
        }
      },
      [chatRef, isNearBottom]
    );

  useEffect(() => {
    if (
      !chatRef.current ||
      !isNearBottom
    ) {
      return;
    }

    const animationFrame =
      requestAnimationFrame(() => {
        chatRef.current?.scrollTo({
          top:
            chatRef.current.scrollHeight,
          behavior: "auto",
        });
      });

    return () => {
      cancelAnimationFrame(
        animationFrame
      );
    };
  }, [
    dependency,
    chatRef,
    isNearBottom,
  ]);

  return {
    isNearBottom,
    scrollToBottom,
  };
}
