// const defaultModel = 'llama3.2';
// const defaultModel = 'llama3.1';
const defaultModel = 'gemma2';
// const defaultModel = 'gemma2:2b';

const defaultPromptTemplate = `<!-- Request -->

Decide whether the given text should be hidden based on the given criteria.
Respond with "!!hide!!" if the text matches any of the hide criteria.
Otherwise respond with "!!show!!".
Do not add anything else.

<!-- Hide criteria -->

aggressive, harmful

<!-- Text -->

$COMMENT

<!-- Response -->

`;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    model: defaultModel,
    promptTemplate: defaultPromptTemplate,
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const model = message.model;
  const prompt = message.prompt;

  (async () => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "model": model,
          "prompt": prompt,
          "stream": false
      })
      });
      const responseJSON = await response.json();
      console.debug('response', responseJSON.response);
      sendResponse(responseJSON.response);
    } catch (error) {
      console.error('error', error);
      sendResponse({ error: error });
    }
  })();
  return true;
});
