// Background script to handle communication
chrome.runtime.onInstalled.addListener(() => {
  console.log('Discord Message Cleaner extension installed');
});

// This helps with communication between popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'log') {
    console.log('[Discord Message Cleaner]', request.message);
  }
  
  // Always return true to indicate async response
  return true;
});