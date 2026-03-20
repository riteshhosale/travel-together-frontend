export const notify = (detail) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("fg:notify", { detail }));
};
