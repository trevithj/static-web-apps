/* global PubSub */
/*
    <div style="position: relative;">
        <div id="actual-toaster" style="position: absolute"></div>
    </div>
*/
(function () {
    const style = [
        'position: absolute',
        'bottom: 5rem',
        'right: 10%',
        'border: solid thin red',
        'padding: 1.6rem',
        'cursor: pointer',
        'display: none',
    ].join(";");
    window.addEventListener('load', e => {
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        //Quick, dirty alternative to JSX
        wrapper.innerHTML = `<div id="actual-toaster" style="${style}"></div>`;
        document.body.appendChild(wrapper);

        const toaster = wrapper.querySelector('div#actual-toaster');

        toaster.addEventListener('click', e => {
            e.preventDefault();
            toaster.style.display = 'none';
        })

        function subscriber(t, options) {
            const { type = 'info', msg } = options;
            let html;
            switch(type) {
                case 'error': {
                    html = `<p style="background-color: red; color: cyan;">${msg}</p>`;
                    break;
                }
                case 'warn': {
                    html = `<p style="background-color: orange; color: blue;">${msg}</p>`;
                    break;
                }
                default: {
                    html = `<p style="background-color: blue; color: white;">${msg}</p>`;
                }
            }
            toaster.innerHTML = html;
            toaster.style.display = '';
        }

        window.PubSub.subscribe('ShowToaster', subscriber);
        window.PubSub.subscribe('HideToaster', () => {
            //TODO: add animation?
            toaster.style.display = 'none';
        });

    });
}());
