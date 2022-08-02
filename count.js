const l = require('./list.json').list;

const t = l.reduce((pre, cV) => {
    return pre + cV.columns.reduce((p, c) => p + (c.isStudy ? 0 : c.duration), 0);
}, 0);

console.log('t/3600', t / 3600);
