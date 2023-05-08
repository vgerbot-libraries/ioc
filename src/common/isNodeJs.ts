export const isNodeJs = (() => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        eval('require("os").arch();');
        return true;
    } catch (e) {
        return false;
    }
})();
