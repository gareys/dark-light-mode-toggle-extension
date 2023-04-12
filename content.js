// content.js

// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the request contains the 'enabled' property
  if (request.hasOwnProperty('enabled')) {
    // Toggle dark/light mode based on the value of 'enabled'
    toggleDarkMode(request.enabled);
  }
});

function toggleDarkMode(enabled) {
  let style;
  const id = "dark-theme-magic";
  const ee = document.getElementById(id);
  const css = `
    :root{
      background-color: #fefefe;
      filter: invert(100%)
    }
    img:not([src*=".svg"]), video{
      filter: invert(100%)
    }
  `;
  if (ee != null) {
    ee.parentNode.removeChild(ee);
  } else {
    style = document.createElement('style');
    style.type = "text/css";
    style.id = id;
    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));
    (document.head || document.querySelector('head')).appendChild(style);
  }
}
