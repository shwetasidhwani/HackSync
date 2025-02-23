document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("totalTimeSpent", (data) => {
      document.getElementById("time-spent").textContent = `Time Spent: ${Math.round(data.totalTimeSpent || 0)}s`;
    });
  });
  