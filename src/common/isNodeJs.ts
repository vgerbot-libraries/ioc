export const isNodeJs = (() => {
    try {
        return process.versions.node !== null;
    } catch (_e) {
        return false;
    }
})();
