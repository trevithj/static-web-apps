function makeStore() {
	const map = new Map();

	const pull = (mid, qty = 1) => {
		if(!map.has(mid)) {
			throw new Error(`Unknown material: ${mid}`);
		}
		const soh = map.get(mid);
		if(soh < qty) {
			return 0;
		} else {
			map.set(mid, soh - qty);
			return qty;
		}
	}

	const push = (mid, qty = 1) => {
		const soh = map.get(mid) || 0;
		map.set(mid, soh + qty);
	}

	const peek = (mid) => map.get(mid);

  const values = () => [...map.values()];
  const IDs = () => [...map.keys()];

//	const toString = () => [...map.values()].map(m => lTrim(m,3)).join(' ');

	const init = (pairs) => {
		pairs.forEach(([mid, value]) => {
			push(mid, value);
		})
	}

	return { pull, push, peek, init, values, IDs };
}

module.exports = makeStore;
