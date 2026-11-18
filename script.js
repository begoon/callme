import { icons } from "./icons.js";
import { buildLinks, decodeState, encodeState, isNationalNumber } from "./links.js";

const SVG = "http://www.w3.org/2000/svg";
const EXAMPLE = "44 (759) 000 1122";

const telElement = document.getElementById("tel");
const textElement = document.getElementById("text");
const hintElement = document.getElementById("hint");
const linksElement = document.getElementById("links");

function iconElement(id) {
    const { color, viewBox, d } = icons[id];
    const svgElement = document.createElementNS(SVG, "svg");
    svgElement.setAttribute("viewBox", viewBox);
    svgElement.setAttribute("aria-hidden", "true");
    svgElement.classList.add("icon");
    svgElement.style.color = color;
    const pathElement = document.createElementNS(SVG, "path");
    pathElement.setAttribute("d", d);
    svgElement.append(pathElement);
    return svgElement;
}

function rowElement({ id, name, link }) {
    const copyElement = document.createElement("span");
    copyElement.className = "copy";
    copyElement.role = "button";
    copyElement.tabIndex = 0;
    copyElement.title = `Copy the ${name} link`;
    copyElement.dataset.link = link;
    copyElement.append(iconElement(id));

    const linkElement = document.createElement("a");
    linkElement.href = link;
    linkElement.target = "_blank";
    linkElement.rel = "noopener";
    linkElement.textContent = link;

    const copiedElement = document.createElement("small");
    copiedElement.className = "copied";
    copiedElement.textContent = "Copied";
    copiedElement.hidden = true;

    const element = document.createElement("div");
    element.className = "row";
    element.append(copyElement, linkElement, copiedElement);
    return element;
}

function hint(input) {
    if (!input.trim()) return "Type a phone number or a username.";
    if (isNationalNumber(input)) return "This looks like a national number. Add the country code, e.g. 44 7590 001122.";
    return "";
}

function render() {
    const input = telElement.value;
    const links = buildLinks(input, textElement.value);
    const state = encodeState(input, textElement.value);
    if (state) {
        const link = location.origin + location.pathname + "#" + state;
        links.push({ id: "share", name: "page", link });
    }
    linksElement.replaceChildren(...links.map(rowElement));
    hintElement.textContent = hint(input);
    hintElement.hidden = !hintElement.textContent;
    return state;
}

function update() {
    const state = render();
    history.replaceState(null, "", state ? "#" + state : location.pathname);
}

function load() {
    const { input, text } = decodeState(location.hash);
    telElement.value = input || EXAMPLE;
    textElement.value = text;
    render();
}

async function copy(copyElement) {
    await navigator.clipboard.writeText(copyElement.dataset.link);
    const copiedElement = copyElement.parentElement.querySelector(".copied");
    copiedElement.hidden = false;
    setTimeout(() => (copiedElement.hidden = true), 2000);
}

linksElement.addEventListener("click", (event) => {
    const copyElement = event.target.closest(".copy");
    if (copyElement) copy(copyElement);
});

linksElement.addEventListener("keydown", (event) => {
    const copyElement = event.target.closest(".copy");
    if (!copyElement || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    copy(copyElement);
});

for (const exampleElement of document.querySelectorAll(".example")) {
    exampleElement.addEventListener("click", () => {
        telElement.value = exampleElement.textContent;
        update();
    });
}

telElement.addEventListener("input", update);
textElement.addEventListener("input", update);
window.addEventListener("hashchange", load);
load();
