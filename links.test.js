import { expect, test } from "bun:test";

import { icons } from "./icons.js";
import {
    buildLinks,
    decodeState,
    encodeState,
    isNationalNumber,
    isPhoneNumber,
    normalizeTel,
    normalizeUsername,
    services,
} from "./links.js";

const linksById = (input, text) => Object.fromEntries(buildLinks(input, text).map(({ id, link }) => [id, link]));

test.each([
    ["", ""],
    ["123", "123"],
    [" 1 2  34 ", "1234"],
    [" +44 (759) 000 123 34 56  ", "447590001233456"],
    [" +0044 (759) 000 123 34 56  ", "447590001233456"],
    ["abc", ""],
    ["a1b23c", "123"],
    [" a01 b23  cd4  ", "1234"],
])("normalizeTel(%p)", (input, expected) => {
    expect(normalizeTel(input)).toBe(expected);
});

test.each([
    ["", ""],
    ["abc", "abc"],
    [" @BotFather ", "BotFather"],
    [" abc 01 2 34f", "abc01234f"],
])("normalizeUsername(%p)", (input, expected) => {
    expect(normalizeUsername(input)).toBe(expected);
});

test.each([
    ["123", true],
    [" +44 (759) 000-123.34 56 ", true],
    ["", false],
    ["()", false],
    ["abc", false],
    ["user123", false],
    ["@user", false],
])("isPhoneNumber(%p)", (input, expected) => {
    expect(isPhoneNumber(input)).toBe(expected);
});

test.each([
    ["07590 001122", true],
    ["(0759) 000 1122", true],
    ["0044 7590 001122", false],
    ["+44 7590 001122", false],
    ["447590001122", false],
    ["0user", false],
    ["", false],
])("isNationalNumber(%p)", (input, expected) => {
    expect(isNationalNumber(input)).toBe(expected);
});

test("phone number gives only the phone services", () => {
    expect(linksById(" +44 (759) 000 1122 ")).toEqual({
        wa: "https://wa.me/447590001122",
        tg: "https://t.me/+447590001122",
        sg: "https://signal.me/#p/+447590001122",
        viber: "viber://chat?number=447590001122",
        tel: "tel:+447590001122",
        sms: "sms:+447590001122",
        facetime: "facetime:+447590001122",
        zalo: "https://zalo.me/447590001122",
    });
});

test("username gives only the username services", () => {
    expect(linksById(" @BotFather ")).toEqual({
        tg: "https://t.me/BotFather",
        messenger: "https://m.me/BotFather",
        instagram: "https://ig.me/m/BotFather",
        snapchat: "https://www.snapchat.com/add/BotFather",
        line: "https://line.me/ti/p/~BotFather",
    });
});

test.each(["", "   ", "()", "@", "000", "07590 001122"])("buildLinks(%p) is empty", (input) => {
    expect(buildLinks(input, "hello")).toEqual([]);
});

test("message is prefilled where the service supports it", () => {
    const phone = linksById("447590001122", " call me & more ");
    expect(phone.wa).toBe("https://wa.me/447590001122?text=call%20me%20%26%20more");
    expect(phone.tg).toBe("https://t.me/+447590001122?text=call%20me%20%26%20more");
    expect(phone.sms).toBe("sms:+447590001122?&body=call%20me%20%26%20more");
    expect(phone.sg).toBe("https://signal.me/#p/+447590001122");

    const username = linksById("BotFather", "hi");
    expect(username.tg).toBe("https://t.me/BotFather?text=hi");
    expect(username.messenger).toBe("https://m.me/BotFather?text=hi");
    expect(username.instagram).toBe("https://ig.me/m/BotFather");
});

test("username is escaped in links", () => {
    expect(linksById("a/b?c#d").tg).toBe("https://t.me/a%2Fb%3Fc%23d");
});

test.each([
    ["", "", ""],
    [" +44 (759) 000 1122 ", "", "447590001122"],
    ["@BotFather", "", "BotFather"],
    ["07590 001122", "", "07590001122"],
    ["447590001122", " call me & more ", "447590001122&text=call%20me%20%26%20more"],
    ["a&text=b", "", "a%26text%3Db"],
])("encodeState(%p, %p)", (input, text, expected) => {
    expect(encodeState(input, text)).toBe(expected);
});

test.each([
    ["447590001122", ""],
    ["BotFather", "call me & more"],
    ["a&text=b", "x&text=y"],
])("decodeState reverses encodeState(%p, %p)", (input, text) => {
    expect(decodeState("#" + encodeState(input, text))).toEqual({ input, text });
});

test.each(["", "#", "#%E0%A4%A"])("decodeState(%p) is empty", (hash) => {
    expect(decodeState(hash)).toEqual({ input: "", text: "" });
});

test("every service and the share row have an icon", () => {
    for (const id of [...services.map((service) => service.id), "share"]) {
        expect(icons[id].d).toBeTruthy();
    }
});
