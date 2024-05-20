import BASE from "../../common/modules/base.js";
import { initView } from "./view.js";
import { initState } from "./state.js";

const Selectors = {
    main:'#display', menu: '#menu', editor: '#editor'
}
BASE.value('Selectors', Selectors);

initView(Selectors);
initState(BASE);

const theMenu = document.querySelector(Selectors.menu);

theMenu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => BASE.dispatch('BTN_CLICKED', btn));
})
//basic pattern
BASE.listen("SOMETHING_HAPPENED", function(data) {
    BASE.dispatch("DO_SOMETHING", {});
});
