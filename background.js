let url = 'https://api.etherscan.io/api\?module=gastracker\&action=gasoracle';

// Read from config file
const config = chrome.runtime.getURL('./config.json');
fetch(config)
    .then((response) => response.json())
    .then((data) => {
        url = `${url}\&apykey=${data.etherscan_api_key}`;
    });

chrome.runtime.onMessage.addListener(data => {
    if (data.type === 'setGasLimit') {
        const limit = data.message;
        updateGasInfo(limit);
    }
});

chrome.alarms.onAlarm.addListener(() => {
    // Get limit from the local storage
    chrome.storage.local.get(['limit'], (value) => {
        console.log(`Limit: ${value.limit}`)
        updateGasInfo(value.limit);
    });
});

const options = {
    method: "GET",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    }
};

const canvas = new OffscreenCanvas(16, 16);
const context = canvas.getContext('2d');
context.clearRect(0, 0, 16, 16);

const updateGasInfo = (limit) => {
    fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
            const safeGasPrice = data.result.SafeGasPrice;
            chrome.action.setBadgeText({ text: safeGasPrice }, () => { });

            if (safeGasPrice <= limit) {
                context.fillStyle = '#00FF00'; // Green
            } else {
                context.fillStyle = '#FF0000'; // Red
            }

            context.fillRect(0, 0, 16, 16);
            const imageData = context.getImageData(0, 0, 16, 16);
            chrome.action.setIcon({ imageData: imageData }, () => { });
        });
}
