import { expect, test } from "bun:test";

import { buildLinks, isPhoneNumber, normalizeTel, removeBlanks, telegramLink } from "./links.js";

test.each([
    ["", ""],
    ["123", "123"],
    [" 1 2  34 ", "1234"],
    ["abc", "abc"],
    [" a b  cd  ", "abcd"],
    [" a1 b 23 cd  ", "a1b23cd"],
])("removeBlanks(%p)", (input, expected) => {
    expect(removeBlanks(input)).toBe(expected);
});

const normalized = [
    ["", ""],
    ["123", "123"],
    [" 1 2  34 ", "1234"],
    [" +44 (759) 000 123 34 56  ", "447590001233456"],
    [" +0044 (759) 000 123 34 56  ", "447590001233456"],
    ["abc", ""],
    [" a b  cd  ", ""],
    ["a1b23c", "123"],
    [" a01 b23  cd4  ", "1234"],
];

test.each(normalized)("normalizeTel(%p)", (input, expected) => {
    expect(normalizeTel(input)).toBe(expected);
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
    ["", ""],
    ["123", "+123"],
    [" 1 2  34 ", "+1234"],
    [" +44 (759) 000 123 34 56  ", "+447590001233456"],
    [" +0044 (759) 000 123 34 56  ", "+447590001233456"],
    ["abc", "abc"],
    ["BotFather", "BotFather"],
    [" @BotFather ", "BotFather"],
    [" abc 01 2 34f", "abc01234f"],
])("telegramLink(%p)", (input, expected) => {
    expect(telegramLink(input)).toBe("https://t.me/" + expected);
});

test.each(normalized)("buildLinks(%p)", (input, tel) => {
    const links = buildLinks(input);
    expect(links.wa).toBe("https://api.whatsapp.com/send?phone=" + tel);
    expect(links.wa2).toBe("https://wa.me/" + tel);
    expect(links.sg).toBe("https://signal.me/#p/+" + tel);
    expect(links.viber).toBe("viber://chat?number=" + tel);
    expect(links.tg).toBe(telegramLink(input));
});

test("buildLinks has one link per page row", () => {
    expect(Object.keys(buildLinks("1"))).toEqual(["wa", "wa2", "tg", "sg", "viber"]);
});
