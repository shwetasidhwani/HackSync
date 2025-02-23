let startTime = 0;
let totalTimeSpent = 0;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube.com/shorts")) {
    if (changeInfo.status === "complete") {
      startTime = Date.now();
    }
  } else {
    if (startTime > 0) {
      let endTime = Date.now();
      totalTimeSpent += (endTime - startTime) / 1000;
      startTime = 0;
      chrome.storage.local.set({ totalTimeSpent });
    }
  }
});
