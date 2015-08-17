chrome.runtime.onMessage.addListener(function(request, sender) {
  chrome.tabs.insertCSS(sender.tab.id, {
    file: 'style.css',
    runAt: 'document_start'
  });
});
