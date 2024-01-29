export const isNodeJs = (() => {
    try {
        return process.versions.node !== null;
    } catch (e) {
        return false;
    }
})();
