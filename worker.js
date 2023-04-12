chrome.action.onClicked.addListener(async (tab) => {
  const hostname = new URL(tab.url).hostname;

  // Check if the current hostname is already in the list
  const sites = await getSavedSites();
  if (sites.includes(hostname)) {
    // If the hostname is in the list, remove it and toggle off dark mode
    removeFromSavedSites(hostname);
    toggleDarkMode(false, tab);
  } else {
    // If the hostname is not in the list, add it and toggle on dark mode
    addToSavedSites(hostname);
    toggleDarkMode(true, tab);
  }
});

function toggleDarkMode(enabled, tab) {
  // Send a message to the content script in the active tab
  chrome.tabs.sendMessage(tab.id, { enabled: enabled });
}

function getSavedSites() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ sites: [] }, (result) => {
      resolve(result.sites);
    });
  });
}

function addToSavedSites(hostname) {
  getSavedSites().then((sites) => {
    sites.push(hostname);
    chrome.storage.local.set({ sites: sites });
  });
}

function removeFromSavedSites(hostname) {
  getSavedSites().then((sites) => {
    const index = sites.indexOf(hostname);
    if (index !== -1) {
      sites.splice(index, 1);
      chrome.storage.local.set({ sites: sites });
    }
  });
}

// Automatically enable dark mode for saved sites on page load
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    const hostname = new URL(tab.url).hostname;
    getSavedSites().then((sites) => {
      if (sites.includes(hostname)) {
        toggleDarkMode(true, tab);
      }
    });
  }
});