// Writes a hash of the precached files into sw.js as VERSION: `bun stamp.js`.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const SW = new URL("sw.js", import.meta.url);
const VERSION = /const VERSION = "([^"]*)";/;

export function precachedFiles() {
    const list = readFileSync(SW, "utf-8").match(/const FILES = (\[[^\]]*\]);/)[1];
    return JSON.parse(list).filter((file) => file !== "./");
}

export function stampedVersion() {
    return readFileSync(SW, "utf-8").match(VERSION)[1];
}

export function currentVersion() {
    const hash = createHash("sha256");
    // sw.js itself counts too, with its VERSION blanked so the hash is stable.
    hash.update(readFileSync(SW, "utf-8").replace(VERSION, ""));
    for (const file of precachedFiles()) {
        hash.update(file);
        hash.update(readFileSync(new URL(file, import.meta.url)));
    }
    return hash.digest("hex").slice(0, 12);
}

if (import.meta.main) {
    const version = currentVersion();
    writeFileSync(SW, readFileSync(SW, "utf-8").replace(VERSION, `const VERSION = "${version}";`));
    console.log("sw.js", version);
}
