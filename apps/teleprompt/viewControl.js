(function () {

    const SEL = BASE.value('SELECTORS');
    const toggleViewBtn = BASE.select(SEL.btnView);
    const toggleRunBtn = BASE.select(SEL.btnRun);
    const fasterBtn = BASE.select(SEL.btnFaster);
    const slowerBtn = BASE.select(SEL.btnSlower);
    const resetBtn = BASE.select(SEL.btnReset);
    const speedDiv = BASE.select(SEL.divSpeed);
    const viewInput = BASE.select(SEL.viewInput);
    const viewDisplay = BASE.select(SEL.viewDisplay);
    const viewMarker = BASE.select(SEL.viewMarker);

    //Check for cached text
    const text = localStorage.getItem('TEXT');
    if(text) {
        BASE.select(SEL.textInput).innerHTML = text;
    }

    function showDisplay(show) {
        const display = show ? '' : 'none';
        viewDisplay.style.display = display;
        viewMarker.style.display = display;
        toggleViewBtn.innerHTML = show ? 'Edit' : 'Show';
        toggleRunBtn.disabled = !show;
        viewInput.style.display = show ? 'none' : '';
    }
    showDisplay(false);
    speedDiv.innerHTML = BASE.value('SPEED') || 0;

    function toggleView() {
        if (toggleViewBtn.innerHTML === 'Edit') {
            showDisplay(false);
        } else {
            showDisplay(true);
            BASE.send('refreshDisplay');
        }
    }
    toggleViewBtn.addEventListener('click', toggleView);

    function toggleRun() {
        if (toggleRunBtn.innerHTML === 'Run') {
            toggleRunBtn.innerHTML = 'Stop';
            showDisplay(true);
            BASE.send('scrollText', true);
        } else {
            toggleRunBtn.innerHTML = 'Run';
            BASE.send('scrollText', false);
        }
    };
    toggleRunBtn.addEventListener('click', toggleRun);

    function setSpeed(delta) {
        const inc = BASE.value('SPEED');
        const newInc = inc + delta;
        BASE.value('SPEED', Math.max(1, newInc));
        speedDiv.innerHTML = BASE.value('SPEED');
    }
    const faster = () => setSpeed(1);
    fasterBtn.addEventListener('click', faster);

    const slower = () => setSpeed(-1);
    slowerBtn.addEventListener('click', slower);

    resetBtn.addEventListener('click', () => {
        toggleRunBtn.innerHTML = 'Run';
        BASE.send('reset');
    });

    // document.addEventListener('keyup', keyEvent => {
    //     switch (keyEvent.code) {
    //         case 'KeyV':
    //             toggleView();
    //             break;
    //         case 'ArrowUp':
    //         case 'NumpadAdd':
    //             faster();
    //             break;
    //         case 'ArrowDown':
    //         case 'NumpadSubtract':
    //             slower();
    //             break;
    //         case 'KeyR':
    //         case 'Space':
    //             toggleRun();
    //             break;
    //         case 'Escape':
    //         case 'KeyX':
    //             BASE.send('reset');
    //             break;
    //     }
    //     return false;
    // });

    console.log('viewControl setup completed');
}());
