export function initOrders(BASE) {
    const {data:data310} = BASE.getState();
    const ordersEl = BASE.select(".orders");
    const orderHTML = [
        '<div class="orderGrid">',
        '<h3>ProductID</h3>',
        '<h3>Quantity</h3>',
        '<h3>Price</h3>',
        '<h3>Delivered</h3>',
    ];
    data310.orders.map(order => {
        const { id, qty, price, delivered = 0 } = order;
        orderHTML.push(`<p>${id}</p><p>${qty}</p><p>${price}</p><p>${delivered}</p>`);
    });
    orderHTML.push('</div>');
    ordersEl.innerHTML = orderHTML.join('');
};