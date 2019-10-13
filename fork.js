const Module = require('module');
const script = process.argv[2];

//MAIN
if (script) {
    requireFromString(script).then(res => {
            jsTransformator = res;
        })
        .catch(err => {
            endFork("error", '' + err);
        });

} else {
    endFork("error", "Script must be setted.");
}

function baseFunction(fn) {
    return `module.exports = async function jsTransformator(args){${fn}}`
};

function requireFromString(code) {
    return new Promise((resolve, reject) => {
        try {
            const fn = baseFunction(code);
            const m = new Module('id');
            m._compile(fn, 'id');
            resolve(m.exports);
        } catch (error) {
            reject('script error:' + error);
        }
    });
};

//ON MESSAGE:
process.on('message', (m) => {
    if (jsTransformator) {
        jsTransformator(m)
            .then(res => {
                endFork("end", '', res || '');
            }).catch(err => {
                endFork("error", err);
            })
    } else {
        endFork("error", "Invalid script can't be called.");
    }
});

// ON uncaughtException:
process.on('uncaughtException', (err) => {
    endFork("error", err);
});

// End-Fork method:
function endFork(type, message, output) {
    const res = {
        type,
        message: '' + message || '',
        output: output
    };
    process.send(res);
    process.exit();
}