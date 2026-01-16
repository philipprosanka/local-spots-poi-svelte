import "clsx";
import { N as Navbar } from "../../chunks/Navbar.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, children } = $$props;
    $$renderer2.push(`<div class="app-container">`);
    Navbar($$renderer2, { user: data.user });
    $$renderer2.push(`<!----> <main class="main-content">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main></div>`);
  });
}
export {
  _layout as default
};
