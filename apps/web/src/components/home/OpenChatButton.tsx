"use client";

export function OpenChatButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`btn btn-outline ${className}`.trim()}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("portfolio:open-chat"));
      }}
    >
      Ask the portfolio
    </button>
  );
}
