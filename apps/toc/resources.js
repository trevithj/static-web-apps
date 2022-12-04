(function(){
    // The resources
    //TODO: refactor to use one element per resource

    const {data310} = STATIC;
    const macsEl = BASE.select(".resources");
    const macs = data310.macs.map(mac => {
        const element = document.createElement('div');
        element.classList.add('macGrid');
        return {...mac, fill: data310.macColors[mac.type], currentOp: null, element}
    });
    // info.macsEl.querySelector('thead').innerHTML = `
    // <tr><th>ID</th><th>Type</th><th>Setup</th><th>Current Op</th></tr>
    // `.trim();
    macsEl.innerHTML = `
        <div class="macGrid"><h3>ID</h3><h3>Type</h3><h3>Setup</h3><h3>Current Op</h3></div>
        `.trim();
    function renderMac(mac) {
        const {id, type, setup, fill, currentOp} = mac;
        const style = `style="background-color: ${fill} ; color: white;"`;
        mac.element.innerHTML = `
            <p ${style}>${id}</p><p ${style}>${type}</p><p ${style}>${setup}</p><p ${style}>${currentOp || '-'}</p>
            `.trim();
    }
    macs.forEach(mac => {
        renderMac(mac);
        macsEl.appendChild(mac.element);
    });

}());
