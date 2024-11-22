const seenTweets = new Set();

async function applyFilter() {
  console.log('applyFilter');

  const { model } = await chrome.storage.sync.get('model');
  const { promptTemplate } = await chrome.storage.sync.get('promptTemplate');

  const pageTweets = document.querySelectorAll('[data-testid="tweetText"]');
  const newTweets = new Set();
  pageTweets.forEach(e => {
    if (!seenTweets.has(e)) {
      newTweets.add(e);
      seenTweets.add(e);
    }
  });

  console.debug('newTweets', newTweets.size);

  for (const tweet of newTweets) {
    const prompt = promptTemplate.replace('$COMMENT', tweet.innerText);
    
    const req = {
      model,
      prompt,
    }
    console.debug('req', req);

    const response = await chrome.runtime.sendMessage(req);
    console.debug('response', response);

    if (response.trim().startsWith('!!hide!!')) {
      const orig = tweet.innerText;
      const mod = 'hidden (hover to show)'
      tweet.innerText = mod;

      // show original text on mouse hover
      tweet.onmouseenter = () => {
        tweet.innerText = orig;
      };
      tweet.onmouseleave = () => {
        tweet.innerText = mod;
      };
    }
  }
}

const observer = new MutationObserver(applyFilter);
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
