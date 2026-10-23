const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

function fixture(definition = {}) {
    let api;
    let value = 0;
    const sandbox = {
        define: (name, dependencies, factory) => { api = factory(); },
        requestAnimationFrame: callback => setTimeout(() => callback(performance.now()), 16),
        cancelAnimationFrame: clearTimeout,
        setTimeout,
        clearTimeout,
        performance,
        console
    };
    sandbox.window = sandbox;
    runInNewContext(readFileSync(resolve(__dirname, "../dist/index.js"), "utf8"), sandbox);
    const context = {
        getHtmlElement: () => ({
            styler: {
                get: () => value,
                set: (track, latest) => { value = latest; }
            }
        })
    };
    const animation = new api.Animation({
        animations: [{ track: "opacity", from: 0, to: 1, duration: 100, ...definition }]
    }, context);
    return { animation, value: () => value };
}

test("native playback completes asynchronously and reports progress", { timeout: 3000 }, async () => {
    const state = fixture({ delay: 25 });
    await state.animation.startAsync();
    assert.equal(state.value(), 1);
    assert.equal(state.animation.getProgress(), 1);
    assert.equal(state.animation.getElapsed(), 125);
});

for (const mode of ["loop", "flip", "yoyo"]) {
    test(`native ${mode} repeats complete`, { timeout: 3000 }, async () => {
        const state = fixture({ [mode]: 1 });
        await state.animation.startAsync();
        assert.equal(state.value(), mode === "loop" ? 1 : 0);
    });
}

test("stop pauses native playback and start seeks and resumes it", { timeout: 3000 }, async () => {
    const state = fixture();
    let signalUpdate;
    const started = new Promise(resolve => { signalUpdate = resolve; });
    const completed = new Promise(resolve => state.animation.start(resolve));
    const poll = setInterval(() => {
        if (state.animation.getProgress() > 0) {
            clearInterval(poll);
            signalUpdate();
        }
    }, 5);
    try {
        await started;
        state.animation.stop();
        const paused = state.animation.getElapsed();
        await new Promise(resolve => setTimeout(resolve, 50));
        assert.equal(state.animation.getElapsed(), paused);
        state.animation.start();
        await completed;
        assert.equal(state.value(), 1);
    } finally {
        clearInterval(poll);
        state.animation.stop();
    }
});