# Notes for coding agents

`callme` is a static page, served by GitHub Pages at <https://demin.ws/callme/>, that turns a phone number or username into "contact me" links. See `README.md` for what it does and the file map.

## Ground rules

- **No framework, no build step, no dependencies.** The browser loads the files exactly as they are in the repo. Do not add npm packages, a bundler or a transpiler.
- **Bun is the only tool.** Use it for tests (`bun test`), the dev server (`bun index.html`) and scripts. Do not add Node-only tooling or another test runner.
- **The site is served from a subpath.** Every URL in the page, the manifest and the service worker must be relative (`./`, `icons/…`). An absolute `/…` path breaks under `/callme/`.
- **Leave the Google Analytics snippet in `index.html` alone** unless the owner asks for a change.

## Commands

    make dev      # dev server on http://localhost:3000, with live reload
    make test     # run all tests
    make stamp    # refresh VERSION in sw.js

## The stamp rule

`sw.js` holds a `VERSION` hashed from the files listed in its `FILES` array. Browsers detect a release only because that constant changes.

- After editing any file in `FILES`, or `sw.js` itself, run `make stamp` before committing.
- When you add a file the page loads, add it to `FILES` and then stamp.
- `sw.test.js` fails on a stale stamp, a missing cached file, or a page script that is not in `FILES`.

## Where things go

- **`links.js` stays pure.** No DOM, no `window`, no storage: only functions from strings to strings, so `links.test.js` can cover them directly. A new service is one entry in `services`.
- **`script.js` owns the DOM.** Rows are generated from what `buildLinks` returns; do not hard-code service rows in `index.html`.
- **`icons.js` is data.** Each icon is `{ color, viewBox, d }`. Brand marks come from Simple Icons, generic ones from Bootstrap Icons. Every service `id` needs an icon with the same `id`; a test checks this.
- **Styles live in the `<style>` block of `index.html`**, on top of Pico CSS v1 in `css/`. Pico styles `button` and `[role=button]` heavily; icon-like buttons reset it with `all: unset`, and then need their own `[hidden] { display: none; }` rule.

## Code conventions

- Name variables that hold DOM elements with an `Element` suffix (`telElement`, `linksElement`), never `El`.
- Use ES modules with relative imports that include the `.js` extension.
- Wrap `localStorage` access in `try`/`catch`; the page must work without it.
- Encode anything user-typed that goes into a link with `encodeURIComponent`, and put it on the page with `textContent`, never `innerHTML`.

## Testing

- Unit tests cover `links.js` and the stamp. Add cases there for any change to link building or input handling.
- The service worker does not register on `localhost`. To exercise it, serve the folder from `127.0.0.1` with any static server.
- Link formats for some services (Instagram, Snapchat, LINE, Zalo, FaceTime, the SMS body, Viber by phone number) follow commonly published forms, not vendor documentation. Verify against the vendor before changing one, and say so when you could not.

## Git

- Conventional Commits subjects: `feat: …`, `fix: …`, `docs: …`.
- No `Co-Authored-By` trailers and no AI attribution lines in commits or pull requests.
- A push to `main` deploys. Commit and push only when asked.
