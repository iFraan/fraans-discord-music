const DAYinMS = 1000 * 60 * 60 * 24;
const prefix = '!';

const colors = {
    'now-playing': 0x4468b8,
    'paused': 0x946828,
    'queue': 0xb84e44,
    'skipped': 0x44b868,
    'disconnected': 0x44b868,
    'light-blue': 0x5488c8,
}

const components = {
    ButtonPlayingBar: require('./lib/components/ButtonPlayingBar'),
    EmbedPages: require('./lib/components/EmbedPages')
};

module.exports = {
    DAYinMS,
    prefix,
    colors,
    components
}