# callme

[![Test](https://github.com/begoon/callme/actions/workflows/test.yaml/badge.svg?branch=main)](https://github.com/begoon/callme/actions/workflows/test.yaml)

Type a phone number or a username and get ready-made links that open a chat or a call with you in WhatsApp, Telegram, Signal, Viber and other messengers.

**[demin.ws/callme](https://demin.ws/callme/)**

## What it does

- **Links that fit the input.** A phone number gives the phone-based services, a username the username-based ones.
- **Copy with one click.** Click a logo to copy its link; click the link itself to try it.
- **Prefilled message.** An optional message is added to the links of the services that support it.
- **Shareable page.** The page address carries your input, e.g. `https://demin.ws/callme/#447590001122`, so you can send the page itself as your "contact me" card.
- **Installable and offline.** The page is a PWA: install it from the browser and it works without a connection.
- **Light and dark themes.** The page follows the system setting until you pick one with the switcher.

The links are built in the browser; what you type is not sent to a server by the app.

## Supported services

| Service | Link | Input | Prefilled message |
| --- | --- | --- | --- |
| WhatsApp | `https://wa.me/<number>` | number | yes |
| Telegram | `https://t.me/+<number>`, `https://t.me/<username>` | number or username | yes |
| Signal | `https://signal.me/#p/+<number>` | number | |
| Viber | `viber://chat?number=<number>` | number | |
| Phone call | `tel:+<number>` | number | |
| SMS | `sms:+<number>` | number | yes |
| FaceTime | `facetime:+<number>` | number | |
| Zalo | `https://zalo.me/<number>` | number | |
| Messenger | `https://m.me/<username>` | username | yes |
| Instagram | `https://ig.me/m/<username>` | username | |
| Snapchat | `https://www.snapchat.com/add/<username>` | username | |
| LINE | `https://line.me/ti/p/~<id>` | username | |

Phone numbers must be in the international format. Spaces, brackets, dashes, a leading `+` or `00` are all accepted. A national number such as `07590 001122` gets a hint to add the country code instead of links, because the page cannot guess the country.

## How it is built

Plain HTML, CSS and JavaScript modules served as they are: there is no framework and no build step. [Pico CSS](https://picocss.com) provides the styling.

| File | Purpose |
| --- | --- |
| `index.html` | The page and its styles |
| `links.js` | Pure functions: input normalisation, the service table, link building, the state kept in the page address |
| `script.js` | DOM wiring: rendering rows, copying, clearing, the theme switcher |
| `icons.js` | Icon paths and colours as data |
| `pwa.js` | Service worker registration and the update prompt |
| `sw.js` | The service worker: caches the app and serves it offline |
| `stamp.js` | Writes the version of the cached files into `sw.js` |
| `manifest.webmanifest`, `icons/` | What makes the page installable |

## Development

You need [Bun](https://bun.sh); there are no dependencies to install.

    make dev      # local server with live reload on http://localhost:3000
    make test     # unit tests
    make stamp    # refresh the version in sw.js
    make live     # open the deployed site

The service worker is not registered on `localhost`, so the dev server always shows your latest edits.

### Releasing

Every push to `main` is published by GitHub Pages.

Before committing a change to any file the app serves, run `make stamp`. It hashes those files into the `VERSION` constant of `sw.js`, and that changed constant is how browsers notice a new release. The tests fail when the stamp is stale, so CI catches a forgotten one.

Pages that are already open then download the new version in the background and show an "Update" button, which switches to it and reloads.

### Adding a service

1. Add an entry to `services` in `links.js` with a `phone` builder, a `username` builder, or both.
2. Add an icon with the same `id` to `icons.js`.
3. Cover the new link in `links.test.js`, and list the service in the help text of `index.html` and in the table above.
4. Run `make stamp`.

## Credits

Brand icons come from [Simple Icons](https://simpleicons.org) (CC0), the generic ones from [Bootstrap Icons](https://icons.getbootstrap.com) (MIT), and the styling from [Pico CSS](https://picocss.com) (MIT).

## License

[MIT](LICENSE)
