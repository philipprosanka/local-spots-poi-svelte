import { e as escape_html } from "../../../chunks/escaping.js";
import "clsx";
import { U as ensure_array_like, W as attr_style, X as stringify } from "../../../chunks/index2.js";
import { b as ssr_context } from "../../../chunks/context.js";
import { u as userState } from "../../../chunks/runes.svelte.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function SpotMap($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="box p-0" style="overflow: hidden; border-radius: 8px; border: 1px solid #dbdbdb;"><div style="height: 600px; width: 100%;"></div></div> <div class="box mt-4"><h3 class="subtitle is-6 has-text-weight-bold">Map Legend (Private Data)</h3> <div class="is-flex is-flex-wrap-wrap"><!--[-->`);
    const each_array = ensure_array_like(userState.categories);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let cat = each_array[i];
      $$renderer2.push(`<div class="mr-4 mb-2 is-flex is-align-items-center"><span class="mr-2"${attr_style(`display:inline-block; width:15px; height:15px; background-color: #3884ff; filter: hue-rotate(${stringify(i * 137)}deg); border-radius: 50%; border: 1px solid white; box-shadow: 0 0 2px rgba(0,0,0,0.3);`)}></span> <span class="is-size-7">${escape_html(cat.name)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<section class="section"><div class="container"><div class="level"><div class="level-left"><h1 class="title">My Global Map</h1></div> <div class="level-right"><p class="has-text-grey">Showing ${escape_html(data.spots.length)} private spots.</p></div></div> `);
    SpotMap($$renderer2, { spots: data.spots, categories: data.categories });
    $$renderer2.push(`<!----></div></section>`);
  });
}
export {
  _page as default
};
