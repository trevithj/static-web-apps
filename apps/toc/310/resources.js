export function initResources(BASE){
    // The resources
    //TODO: refactor to use one element per resource

    const {data:data310, macColors} = BASE.getState();
    const macsEl = BASE.select(".resources");
    const macs = data310.macs.map(mac => {
        const element = BASE.createEl('div', 'macGrid');
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
            const lastOp = mac.currentOp;
            mac.currentOp = sel.target.value;
            BASE.pub('OPERATION_SET', { mac, lastOp });
        });
    }
    macs.forEach(mac => {
        renderMac(mac);
        macsEl.appendChild(mac.element);
    });

    const rms = data310.stores.flatMap(store => {
        const { type, id, unitCost } = store;
        if (type !== "RM") return [];
        const name = id.replace("ST:", "RM").replace("-0", "");
        return {id, name, unitCost, store};
    });
    console.log(rms);
    const purchasesEl = BASE.createEl('div', 'purchases');
    rms.forEach(rm => {
        const btn = BASE.createEl('button', 'purchase');
        btn.innerText = `${rm.name}@$${rm.unitCost}`;
        btn.addEventListener('click', () => {
            BASE.pub('RM_PURCHASED', rm.store);
        })
        purchasesEl.appendChild(btn);
    })
    macsEl.appendChild(purchasesEl);
};
