export function moveItem(sourceInput, destinationInput, quantity = 1, cb) {
    if (isNaN(quantity) || quantity < 0) {
        throw new Error("Please enter a valid quantity.");
    }

    var sourceValue = parseInt(sourceInput.value);
    if (sourceValue < quantity) {
        throw new Error("Not enough items in the source store.");
    }

    animateItem(sourceInput, destinationInput, 800, () => {
        // Update store values after animation completes
        sourceInput.value = sourceValue - quantity;
        destinationInput.value = parseInt(destinationInput.value) + quantity;
        if (typeof cb === "function") {
            cb(sourceInput, destinationInput);
        }
    });
}

export function animateItem(srcInput, destInput, duration, onAnimationComplete) {
    const item = document.createElement('div');
    item.classList.add('item');
    document.body.appendChild(item);

    const srcRect = srcInput.getBoundingClientRect();
    const destRect = destInput.getBoundingClientRect();

    item.style.top = srcRect.top + 'px';
    item.style.left = srcRect.left + 'px';

    setTimeout(() => {
        item.style.transition = 'top 0.8s, left 0.8s';
        item.style.top = destRect.top + 'px';
        item.style.left = destRect.left + 'px';

        setTimeout(() => {
            item.remove();
            onAnimationComplete();
        }, duration);
    }, 10);
}
