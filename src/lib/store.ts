export const Store = {
  get runId() { return localStorage.getItem("saq.run_id") || ""; },
  set runId(v: string) { localStorage.setItem("saq.run_id", v); },

  get loop() { return localStorage.getItem("saq.loop") || ""; },
  set loop(v: string) { localStorage.setItem("saq.loop", v); },

  get lastSlug() { return localStorage.getItem("saq.last_slug") || ""; },
  set lastSlug(v: string) { localStorage.setItem("saq.last_slug", v); },
};
