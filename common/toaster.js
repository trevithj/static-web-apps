/* global PubSub */
/*
    <div style="position: relative;">
        <div id="actual-toaster" style="position: absolute"></div>
    </div>
*/
window.addEventListener('load', e => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    //Quick, dirty alternative to JSX
    wrapper.innerHTML = `<div id="actual-toaster"></div>`;
    document.body.appendChild(wrapper);

    const toaster = wrapper.querySelector('div#actual-toaster');
    wrapper.style.display = 'none';

    function hideToaster() {
        //TODO: trigger animation of some sort?
        wrapper.style.display = 'none';
        toaster.classList.remove('error', 'warn', 'info');
    }

    toaster.addEventListener('click', e => {
        e.preventDefault();
        hideToaster();
    })

    function subscriber(t, options) {
        hideToaster(); //always reset
        if (t === 'HideToaster') {
            return; //Nothing else to do
        }
        //else assume we are showing the toaster
        const {type = 'info', msg} = options;
        //Expects type to be error|warn|info. Unenforced, though.
        toaster.classList.add(type);

        toaster.innerText = msg; 
        wrapper.style.display = '';
    }

    window.PubSub.subscribe('ShowToaster', subscriber);
    window.PubSub.subscribe('HideToaster', subscriber);
});
