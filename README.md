# callme

[![Test](https://github.com/begoon/callme/actions/workflows/test.yaml/badge.svg?branch=main)](https://github.com/begoon/callme/actions/workflows/test.yaml)

Create instant links to call or message you: WhatsApp, Telegram, Signal, Viber, phone call, SMS, FaceTime and Zalo for a phone number; Telegram, Messenger, Instagram, Snapchat and LINE for a username.

The page address carries the input, e.g. `https://demin.ws/callme/#447590001122`, so the page itself can be shared.

[demin.ws/callme](https://demin.ws/callme/)

Plain HTML and JavaScript, no build step. [Bun](https://bun.sh) runs the tests and the local server:

    bun test
    bun index.html

## Installable app

The page is a PWA: `manifest.webmanifest`, `icons/` and the service worker `sw.js`, which caches every file so the app works offline.

`sw.js` carries a `VERSION` hashed from the cached files. After changing any of them, run `make stamp` (the tests fail if you forget). Open pages then download the new version in the background and show an "Update" button that switches to it.
