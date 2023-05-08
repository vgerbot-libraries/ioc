export const isNodeJs = (() => {
    try {
        eval('require("os").arch();');
        return true;
    } catch (e) {
        return false;
    }
})();
