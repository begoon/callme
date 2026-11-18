import { buildLinks } from "./links.js";

const telElement = document.getElementById("tel");
const tooltipElement = document.getElementById("tooltip");

let links = {};
let tooltipTimeout = null;

function render() {
    links = buildLinks(telElement.value);
    for (const [id, link] of Object.entries(links)) {
        const linkElement = document.getElementById(id);
        linkElement.href = link;
        linkElement.textContent = link;
    }
}

function setTooltip(text) {
    clearTimeout(tooltipTimeout);
    tooltipElement.textContent = text;
    tooltipElement.hidden = false;
    tooltipTimeout = setTimeout(() => (tooltipElement.hidden = true), 3000);
}

for (const copyElement of document.querySelectorAll(".copy")) {
    copyElement.addEventListener("mouseover", () => setTooltip("Click to copy"));
    copyElement.addEventListener("click", async () => {
        await navigator.clipboard.writeText(links[copyElement.dataset.link]);
        setTooltip("Copied");
    });
}

for (const exampleElement of document.querySelectorAll(".example")) {
    exampleElement.addEventListener("mouseover", () => setTooltip("Click to copy an example"));
    exampleElement.addEventListener("click", () => {
        telElement.value = exampleElement.textContent;
        render();
    });
}

telElement.addEventListener("input", render);
render();
