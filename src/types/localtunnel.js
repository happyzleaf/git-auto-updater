const logger = require('../utils/logger').create('LocalTunnel');
const localtunnel = require('localtunnel');

async function start(flags) {
    logger.info('Starting tunnel...');

    const tunnel = await localtunnel({
        port: flags.port,
        subdomain: flags.subdomain,
    });

    if (flags.subdomain && !new RegExp(`^https:\\/\\/${flags.subdomain}\\.loca\\.lt$`).test(tunnel.url)) {
        logger.info('Could not obtain the subdomain \'{}\'. You could try to specify a more unique one.', flags.subdomain);
        return undefined;
    }

    tunnel.on('close', () => {
        logger.info('The tunnel was closed.');
        return undefined;
    });

    return tunnel.url;
}

module.exports = {start};
