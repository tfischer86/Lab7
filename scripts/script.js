// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;

// Make sure you register your service worker here too
if ("serviceWorker" in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register("sw.js");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let mainElement = document.querySelector('main');
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach((entry, index) => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;

        // set state on click
        newPost.addEventListener("click", () => {
          setState({ page: "entry", entryNum: index + 1 });
        });

        mainElement.appendChild(newPost);
      });
    });
});

let header = document.querySelector("header h1");
header.addEventListener("click", () => {
  setState({ page: "home" });
});

let settingsButton = document.querySelector("img[alt='settings']");
settingsButton.addEventListener("click", () => {
  setState({ page: "settings" });
});

window.addEventListener("popstate", (e) => {
  setState(e.state, false);
});