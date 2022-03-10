function buildString(prefix, suffix, message, args) {
    if (message && args && args.length > 0) {
        for (let arg of args) {
            message = message.replace(/{}/, arg);
        }
    }

    return prefix + message + suffix;
}

class Logger {
    constructor(name) {
        this.name = name;
    }

    error(message, ...args) {
        console.log(buildString('\x1b[31m[ERROR] ', '\x1b[0m', message, args));
    }

    info(message, ...args) {
        console.log(buildString(`[${this.name}] `, '', message, args));
    }
}

function create(name) {
    return new Logger(name);
}

module.exports = {create};

