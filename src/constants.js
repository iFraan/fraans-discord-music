const DAYinMS = 1000 * 60 * 60 * 24;
const prefix = '!';

const colors = {
    'now-playing': 0x4468b8,
    'paused': 0x946828,
}

const components = {
    ButtonPlayingBar: require('./lib/components/ButtonPlayingBar')
};

module.exports = {
    DAYinMS,
    prefix,
    colors,
    components
}