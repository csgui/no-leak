const setButton = document.getElementById('set-button');
const limit = document.getElementById('limit');

setButton.addEventListener('click', () => {
    chrome.storage.local.set({ limit: parseInt(limit.value) }, () => {});
	chrome.action.setTitle({ title: `NoLeak! Limit: ${parseInt(limit.value)}` }, () => { });
	chrome.runtime.sendMessage({
		type: 'setGasLimit',
		message: parseInt(limit.value)
	});

	chrome.alarms.create('updateGas', { delayInMinutes: 1, periodInMinutes: 1 });
});
