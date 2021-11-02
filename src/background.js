chrome.commands.onCommand.addListener((command) => {
  console.log('back hello', command);

  if (command === 'copy-all') {
    getCurrTab().then((tabId) => {
      chrome.tabs.sendMessage(tabId, { action: 'copy-all' }, (allCode) => {
        console.log(allCode);
      });
    });
  }
});

async function getCurrTab() {
  let opstions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(opstions);
  return tab.id;
}
