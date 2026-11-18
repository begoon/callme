import { expect, test } from "bun:test";
import { existsSync, readdirSync } from "node:fs";

import { currentVersion, precachedFiles, stampedVersion } from "./stamp.js";

test("sw.js VERSION is up to date (run `make stamp`)", () => {
    expect(stampedVersion()).toBe(currentVersion());
});

test("every precached file exists", () => {
    for (const file of precachedFiles()) {
        expect(existsSync(new URL(file, import.meta.url))).toBe(true);
    }
});

test("every page script is precached", () => {
    const tooling = (file) => file.endsWith(".test.js") || ["sw.js", "stamp.js"].includes(file);
    const scripts = readdirSync(new URL(".", import.meta.url)).filter((file) => file.endsWith(".js") && !tooling(file));
    expect(precachedFiles()).toEqual(expect.arrayContaining(scripts));
});
