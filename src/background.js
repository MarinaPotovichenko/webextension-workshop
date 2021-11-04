// firefox - webextension-polifill - utility npx web-ext (needs manifest 2 ver) - web-ext lint
// safari - xsrun safari-web-extension-converter src:--project-location ./safari
// safari - manifest background "persistent": false -> build in xcode
// safari - for adding -> develop - add un... extention. chrome_overrides -> browser_overrides

function incrementCounter(count) {
  getCounter().then((counter) => {
    chrome.storage.local.set({ counter: counter + count });
  });
}

function getCounter() {
  return chrome.storage.local.get('counter').then((data) => {
    return data.counter ?? 0;
  });
}

chrome.commands.onCommand.addListener((command) => {
  console.log('back hello', command);

  if (command === 'copy-all') {
    getCurrTab().then((tabId) => {
      chrome.tabs.sendMessage(tabId, { action: 'copy-all' }, (allCode) => {
        console.log(allCode);
        incrementCounter(getLOC(allCode));
      });
    });
  }
});

chrome.runtime.onMessage.addListener((req, info, cb) => {
  if (req.action === 'get-count') {
    getCounter().then((counter) => {
      console.log(counter);
      cb(counter);
    });
    return true;
  }
});

function getLOC(code) {
  return code.split('\n').length;
}

async function getCurrTab() {
  let opstions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(opstions);
  return tab.id;
}

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html'),
    });
    chrome.runtime.setUninstallURL('http://localhost:4450/leave');
  }
});
