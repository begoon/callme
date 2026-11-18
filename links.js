export const removeBlanks = (text) => text.replace(/\s/g, "");

export const normalizeTel = (text) => text.replace(/\D/g, "").replace(/^0+/, "");

export const normalizeUsername = (text) => removeBlanks(text).replace(/^@/, "");

// Usernames start with a letter, so anything made only of digits
// and phone punctuation is a phone number.
export const isPhoneNumber = (text) => /^[\d\s()+.-]*\d[\d\s()+.-]*$/.test(text);

// A single leading zero is a national trunk prefix: the country code is missing.
export const isNationalNumber = (text) => isPhoneNumber(text) && /^0(?!0)/.test(text.replace(/\D/g, ""));

const withText = (link, text, parameter = "?text=") => (text ? link + parameter + encodeURIComponent(text) : link);

// Each service builds a link from a phone number, a username, or either.
export const services = [
    { id: "wa", name: "WhatsApp", phone: (tel, text) => withText("https://wa.me/" + tel, text) },
    {
        id: "tg",
        name: "Telegram",
        phone: (tel, text) => withText("https://t.me/+" + tel, text),
        username: (name, text) => withText("https://t.me/" + name, text),
    },
    { id: "sg", name: "Signal", phone: (tel) => "https://signal.me/#p/+" + tel },
    { id: "viber", name: "Viber", phone: (tel) => "viber://chat?number=" + tel },
    { id: "tel", name: "Phone call", phone: (tel) => "tel:+" + tel },
    { id: "sms", name: "SMS", phone: (tel, text) => withText("sms:+" + tel, text, "?&body=") },
    { id: "facetime", name: "FaceTime", phone: (tel) => "facetime:+" + tel },
    { id: "zalo", name: "Zalo", phone: (tel) => "https://zalo.me/" + tel },
    { id: "messenger", name: "Messenger", username: (name, text) => withText("https://m.me/" + name, text) },
    { id: "instagram", name: "Instagram", username: (name) => "https://ig.me/m/" + name },
    { id: "snapchat", name: "Snapchat", username: (name) => "https://www.snapchat.com/add/" + name },
    { id: "line", name: "LINE", username: (name) => "https://line.me/ti/p/~" + name },
];

// The links that make sense for the input: phone services for a number,
// username services for a name, nothing for empty input or for a national
// number, which cannot be dialled internationally without its country code.
export function buildLinks(input, text = "") {
    if (isNationalNumber(input)) return [];
    const message = text.trim();
    const kind = isPhoneNumber(input) ? "phone" : "username";
    const value = kind === "phone" ? normalizeTel(input) : encodeURIComponent(normalizeUsername(input));
    if (!/[\p{L}\p{N}]/u.test(value)) return [];
    return services
        .filter((service) => service[kind])
        .map(({ id, name, [kind]: build }) => ({ id, name, link: build(value, message) }));
}

// The page state kept in the URL fragment, so the page itself can be shared.
export function encodeState(input, text = "") {
    // A national number keeps its zero, so the reopened page shows the same hint.
    const tel = isNationalNumber(input) ? input.replace(/\D/g, "") : normalizeTel(input);
    const value = isPhoneNumber(input) ? tel : normalizeUsername(input);
    if (!/[\p{L}\p{N}]/u.test(value)) return "";
    const message = text.trim();
    return encodeURIComponent(value) + (message ? "&text=" + encodeURIComponent(message) : "");
}

export function decodeState(hash) {
    const [input, text = ""] = hash.replace(/^#/, "").split("&text=");
    try {
        return { input: decodeURIComponent(input), text: decodeURIComponent(text) };
    } catch {
        return { input: "", text: "" };
    }
}
