export const isNodeJs = (() => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const os = require('os');
        os.arch();
        return true;
    } catch (e) {
        return false;
    }
})();
