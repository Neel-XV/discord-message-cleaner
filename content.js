// Variables to track state
let isRunning = false;
let stopRequested = false;
let deletedCount = 0;
let currentChannelId = '';
let currentUserId = '';
let settings = {
  token: '',
  delay: 1500,
  batchSize: 50
};

// Initialize the extension
function init() {
  console.log("[Discord Message Cleaner] Content script loaded");
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[Discord Message Cleaner] Message received:", request.action);
    
    if (request.action === 'start') {
      if (isRunning) {
        sendResponse({status: false, message: 'Deletion already in progress'});
        return true;
      }
      
      settings = request.settings;
      stopRequested = false;
      
      // Check if we're on Discord
      if (!window.location.href.includes('discord.com')) {
        sendResponse({status: false, message: 'Not on Discord'});
        return true;
      }
      
      // Extract channel ID from URL
      const urlParts = window.location.href.split('/');
      currentChannelId = urlParts[urlParts.length - 1];
      
      if (!currentChannelId || !/^\d{17,19}$/.test(currentChannelId)) {
        sendResponse({status: false, message: 'Not in a Discord channel'});
        return true;
      }
      
      // Start the deletion process
      isRunning = true;
      deletedCount = 0;
      
      // Begin the deletion process
      startDeletion().then(result => {
        console.log('[Discord Message Cleaner] Deletion complete:', result);
      }).catch(error => {
        console.error('[Discord Message Cleaner] Deletion error:', error);
      });
      
      sendResponse({status: true, message: 'Deletion started'});
      return true;
    }
    
    else if (request.action === 'stop') {
      stopRequested = true;
      sendResponse({status: true, message: `Deleted ${deletedCount} messages`});
      return true;
    }
    
    else if (request.action === 'status') {
      sendResponse({
        isRunning,
        deletedCount,
        channelId: currentChannelId
      });
      return true;
    }
    
    // This ensures the sendResponse function works properly
    return true;
  });
}

// Function to get user ID from token
async function getUserId(token) {
  try {
    const response = await fetch('https://discord.com/api/v9/users/@me', {
      headers: {
        'authorization': token
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`);
    }
    
    const userData = await response.json();
    return userData.id;
  } catch (error) {
    console.error('[Discord Message Cleaner] Error getting user ID:', error);
    throw error;
  }
}

// Main function to delete messages
async function startDeletion() {
  try {
    console.log('[Discord Message Cleaner] Starting deletion process...');
    
    // Get user ID from token
    currentUserId = await getUserId(settings.token);
    console.log(`[Discord Message Cleaner] Found user ID: ${currentUserId}`);
    
    let hasMoreMessages = true;
    let lastMessageId = null;
    
    // Continue until no more messages or stop requested
    while (hasMoreMessages && !stopRequested) {
      try {
        // Fetch messages
        let apiUrl = `https://discord.com/api/v9/channels/${currentChannelId}/messages?limit=${settings.batchSize}`;
        if (lastMessageId) {
          apiUrl += `&before=${lastMessageId}`;
        }
        
        const response = await fetch(apiUrl, {
          headers: {
            "authorization": settings.token,
            "content-type": "application/json"
          }
        });
        
        if (!response.ok) {
          if (response.status === 429) {
            // Handle rate limiting
            const responseData = await response.json();
            const retryAfter = responseData.retry_after || 5;
            console.log(`[Discord Message Cleaner] Rate limited. Waiting ${retryAfter} seconds...`);
            
            // Wait for the specified time
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            continue;
          } else {
            throw new Error(`Error fetching messages: ${response.status} ${response.statusText}`);
          }
        }
        
        const messages = await response.json();
        
        // Check if we got any messages
        if (!messages || messages.length === 0) {
          console.log('[Discord Message Cleaner] No more messages found');
          hasMoreMessages = false;
          break;
        }
        
        // Update last message ID for pagination
        lastMessageId = messages[messages.length - 1].id;
        
        // Filter for user's messages
        const userMessages = messages.filter(msg => msg.author.id === currentUserId);
        console.log(`[Discord Message Cleaner] Found ${userMessages.length} of your messages in this batch`);
        
        // Delete each message
        for (const message of userMessages) {
          if (stopRequested) {
            console.log('[Discord Message Cleaner] Stopping as requested');
            break;
          }
          
          try {
            const deleteResponse = await fetch(`https://discord.com/api/v9/channels/${currentChannelId}/messages/${message.id}`, {
              method: "DELETE",
              headers: {
                "authorization": settings.token,
                "content-type": "application/json"
              }
            });
            
            if (deleteResponse.ok) {
              deletedCount++;
              const contentPreview = message.content 
                ? (message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')) 
                : '[attachment or embed]';
              console.log(`[Discord Message Cleaner] Deleted message: "${contentPreview}"`);
            } 
            else if (deleteResponse.status === 429) {
              // Handle rate limiting for delete requests
              const retryData = await deleteResponse.json();
              const retryAfter = retryData.retry_after || 5;
              console.log(`[Discord Message Cleaner] Delete rate limited. Waiting ${retryAfter} seconds...`);
              await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
              // Retry this message
              continue;
            } 
            else {
              console.error(`[Discord Message Cleaner] Failed to delete message: ${deleteResponse.status}`);
            }
            
            // Wait between deletions to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, settings.delay));
            
          } catch (deleteError) {
            console.error('[Discord Message Cleaner] Error deleting message:', deleteError);
          }
        }
        
        // Check if we need to continue
        if (userMessages.length === 0 && messages.length < settings.batchSize) {
          console.log('[Discord Message Cleaner] No more of your messages found');
          hasMoreMessages = false;
        }
        
      } catch (error) {
        console.error('[Discord Message Cleaner] Error in deletion loop:', error);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait a bit before retrying
      }
    }
    
    console.log(`[Discord Message Cleaner] Deletion process finished. Deleted ${deletedCount} messages in total.`);
    
    // Reset state
    isRunning = false;
    chrome.storage.local.set({isRunning: false});
    
    return {
      success: true,
      deletedCount
    };
    
  } catch (error) {
    console.error('[Discord Message Cleaner] Fatal error in deletion process:', error);
    isRunning = false;
    chrome.storage.local.set({isRunning: false});
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Initialize when content script loads
init();