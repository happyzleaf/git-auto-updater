const logger = require('../utils/logger').create('ngrok');
const ngrok = require('ngrok');

async function start(flags) {
    logger.info('Starting server...');

    let url;
    try {
        url = await ngrok.connect({
            addr: flags.port,
            subdomain: flags.subdomain,
            region: flags.ngrokregion,
            authtoken: flags.ngroktoken,
        });
    } catch (e) {
        logger.error('Could not start the ngrok tunnel. If you\'ve specified a subdomain, make sure that you have a paid account and you\'ve added the auth token.');
        // console.error(e);
        console.log(e);
        process.exit(0);
    }

    if (flags.subdomain && !new RegExp(`^https:\\/\\/${flags.subdomain}\\.eu\\.ngrok\\.it$`).test(url)) {
        logger.info('Could not obtain the subdomain \'{}\'.', flags.subdomain);
        process.exit(0);
    }

    logger.info('Tunneling \'localhost:{}\' to \'{}\'.', flags.port, tunnel.url);

    logger.info('Done.');
}

module.exports = {start};
