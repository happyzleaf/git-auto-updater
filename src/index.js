const logger = require('./utils/logger').create('Updater');
const args = require('args');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');

const tunnelTypes = ['ngrok', 'localtunnel'];

args.option('port', 'The port to listen to.', 3000)
    .option('type', 'If specified, the application will be served through a tunnel. [ngrok, localtunnel]')
    .option('secret', 'If specified, the secret will be used to authenticate github requests.')
    .option('subdomain', 'If specified, the application will be served with this subdomain. If the subdomain could not be obtained, the application will terminate.')
    .option('ngroktoken', '[ngrok] If specified, the given authtoken will be used.')
    .option('ngrokregion', '[ngrok] If specified, the given region will be used. [us, eu, au, ap, sa, jp, in]');
const flags = args.parse(process.argv);

if (flags.type && !tunnelTypes.includes(flags.type)) {
    logger.error('The type must include one of the following: [{}]', tunnelTypes.toString().replace(/,/g, ', '));
    args.showHelp();
}

const app = express();

app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.raw = buf
    }
}))

app.post('/payload', (req, res) => {
    if (flags.secret) {
        const sig256 = req.headers['x-hub-signature-256'];
        if (!sig256) {
            return res.status(403).send('No signature found in the request');
        }

        const signature = new Buffer(sig256);
        const digest = new Buffer('sha256=' + crypto.createHmac('sha256', flags.secret).update(req.raw).digest('hex'));
        if (!crypto.timingSafeEqual(signature, digest)) {
            return res.status(403).send('Could not verify the request');
        }
    }

    res.send('success');
});

app.listen(flags.port, async () => {
    logger.info('Listening to {}.', flags.port);
    if (flags.type) {
        const url = await require(`./types/${flags.type}`).start(flags);
        if (!url) {
            logger.error('Could not start the tunnel. Exiting...');
            process.exit(0);
        }

        logger.info('Tunneling \'localhost:{}\' to \'{}\'.', flags.port, url);
    }
});
