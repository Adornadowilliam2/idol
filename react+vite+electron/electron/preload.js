window.addEventListener("DOMContentLoaded", () => {
  /** Example of exposing Node.js features */ window.electron = {
    version: process.versions.electron,
  };
});
