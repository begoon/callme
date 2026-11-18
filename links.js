export const removeBlanks = (text) => text.replace(/\s/g, "");

export const normalizeTel = (text) => text.replace(/\D/g, "").replace(/^0+/, "");

// Telegram usernames start with a letter, so anything made only of digits
// and phone punctuation is a phone number.
export const isPhoneNumber = (text) => /^[\d\s()+.-]*\d[\d\s()+.-]*$/.test(text);

export function telegramLink(text) {
    if (isPhoneNumber(text)) return "https://t.me/+" + normalizeTel(text);
    return "https://t.me/" + removeBlanks(text).replace(/^@/, "");
}

export function buildLinks(text) {
    const tel = normalizeTel(text);
    return {
        wa: "https://api.whatsapp.com/send?phone=" + tel,
        wa2: "https://wa.me/" + tel,
        tg: telegramLink(text),
        sg: "https://signal.me/#p/+" + tel,
        viber: "viber://chat?number=" + tel,
    };
}
