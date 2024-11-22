const modelElem = document.getElementById('model');
const promptElem = document.getElementById('prompt-template');
const saveElem = document.getElementById('save');

async function load() {
  const { model } = await chrome.storage.sync.get('model');
  const { promptTemplate } = await chrome.storage.sync.get('promptTemplate');

  modelElem.value = model;
  promptElem.value = promptTemplate;

  saveElem.onclick = async () => {
    await chrome.storage.sync.set({
      model: modelElem.value,
      promptTemplate: promptElem.value,
    });
  }
}

load();
