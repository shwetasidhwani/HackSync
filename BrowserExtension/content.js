let watchStartTime = Date.now();

window.addEventListener("beforeunload", () => {
  let watchEndTime = Date.now();
  let timeSpent = (watchEndTime - watchStartTime) / 1000; // in seconds

  chrome.storage.local.get("totalTimeSpent", (data) => {
    let updatedTime = (data.totalTimeSpent || 0) + timeSpent;
    chrome.storage.local.set({ totalTimeSpent: updatedTime });
  });
});
