(function(){
    // The resources
    //TODO: refactor to use one element per resource

    const {data310, macColors} = STATIC;
    const macsEl = BASE.select(".resources");
    const macs = data310.macs.map(mac => {
        const element = document.createElement('div');
        element.classList.add('macGrid');
        const ops = data310.ops.flatMap(op => op.type === mac.type ? op.id : []);
        const fill = macColors[mac.type];
        return {...mac, ops, fill, currentOp: null, element}
    });
    // info.macsEl.querySelector('thead').innerHTML = `
    // <tr><th>ID</th><th>Type</th><th>Setup</th><th>Current Op</th></tr>
    // `.trim();
    macsEl.innerHTML = `
        <div class="macGrid">
            <h3>ID</h3><h3>Type</h3><h3>Setup</h3><h3>Status</h3><h3>Current Op</h3>
        </div>
        `.trim();
    function renderMac(mac) {
        const {id, ops, type, setup, status = 'idle', fill, currentOp} = mac;
        const style = `style="background-color: ${fill} ; color: white;"`;
        const options = ops.map(opId => `<option value=${opId}>${opId}</option>`);
        options.unshift('<option value="-"> none </option>');
        mac.element.innerHTML = [
            `<p ${style}>${id}</p>`,
            `<p ${style}>${type}</p>`,
            `<p ${style}>${setup}</p>`,
            `<p ${style}>${status}</p>`,
            `<p ${style}><select value=${currentOp || '-'}>${options.join('')}</select></p>`
            ].join('');
        mac.element.querySelector('select').addEventListener('change', sel => {
            mac.currentOp = sel.target.value;
        });
    }
    macs.forEach(mac => {
        renderMac(mac);
        macsEl.appendChild(mac.element);
    });

}());
