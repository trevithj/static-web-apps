function makeSetRM(_data, rm) {
    return delta => {
        _data.rm += delta;
        rm.textContent = _data.rm;
        if (_data.rm < 0) throw new Error("RM cannot be negative")
    }
}

function makeSetWip(_data, op) {
    return v => {
        _data.wip = v;
        op.textContent = _data.wip;
        if (_data.wip < 0) throw new Error("WIP cannot be negative");
    }
}

function doComplete(_data, op, fg) {
    _data.fg += _data.wip;
    _data.wip = 0;
    op.textContent = _data.wip;
    fg.textContent = _data.fg;
}

function firstRender(data, rm, op, fg) {
    rm.textContent = data.rm;
    op.textContent = data.wip ? data.wip : '';
    fg.textContent = data.fg;
}

function makeData(_data, frame, ctrl) {
    const rm = frame.querySelector('.rm');
    const op = frame.querySelector('.op');
    const fg = frame.querySelector('.fg');

    firstRender(_data, rm, op, fg);
    ctrl.querySelector("span").textContent = `${_data.speed}ms`;

    const setRM = makeSetRM(_data, rm);
    const doSetWip= makeSetWip(_data, op);
    return {
        setRM,
        setWip(v) {
            setRM(-v);
            doSetWip(v)
        },
        complete: () => doComplete(_data, op, fg),
        get rm() {return _data.rm;},
        get wip() {return _data.wip;},
        get fg() {return _data.fg;},
        get speed() {return _data.speed;},
        set speed(percent) {
            _data.speed = Math.round(5000 - (4000 * percent / 100));
            ctrl.querySelector("span").textContent = `${_data.speed}ms`;
        }
    }
}
// const data = makeData({
//     rm: 10, wip: 0, fg: 0, speed: 3000
// });


export default makeData;