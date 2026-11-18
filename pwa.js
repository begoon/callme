// Registers the service worker and calls onUpdate(apply) when a new version
// has been downloaded and is waiting; apply() activates it and reloads the page.
export async function registerServiceWorker(onUpdate) {
    // The dev server rewrites file names, so there is nothing stable to cache there.
    if (!("serviceWorker" in navigator) || location.hostname === "localhost") return;

    const registration = await navigator.serviceWorker.register("sw.js");
    let applying = false;

    const offer = (worker) => {
        onUpdate(() => {
            applying = true;
            worker.postMessage("skipWaiting");
        });
    };

    // A worker is an update only when another one already controls the page.
    if (registration.waiting && navigator.serviceWorker.controller) offer(registration.waiting);

    registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) offer(worker);
        });
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (applying) location.reload();
    });

    // An installed app can stay open for days: look for an update when it comes back into view.
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") registration.update();
    });
}
