"use client";

export function OpenChatButton() {
  return (
    <button
      type="button"
      className="btn btn--ghost"
      onClick={() =>
        window.dispatchEvent(new CustomEvent("portfolio:open-chat"))
      }
    >
      Ask anything
    </button>
  );
}
