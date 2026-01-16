import { V as attr, W as attr_style, Z as attr_class, X as stringify, _ as unsubscribe_stores, $ as store_get } from "./index2.js";
import { g as getContext } from "./context.js";
import "clsx";
import "@sveltejs/kit/internal";
import "./exports.js";
import "./utils.js";
import "@sveltejs/kit/internal/server";
import "./state.svelte.js";
import { e as escape_html } from "./escaping.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { user } = $$props;
    function isActive(path) {
      return store_get($$store_subs ??= {}, "$page", page).url.pathname === path ? "is-active" : "";
    }
    $$renderer2.push(`<nav class="navbar is-coffee svelte-rfuq4y" aria-label="main navigation"><div class="container"><div class="navbar-brand"><a class="navbar-item title is-4 coffee-text mb-0 svelte-rfuq4y"${attr("href", user ? "/dashboard" : "/")}${attr_style(!user ? "cursor: default;" : "")}><i class="fas fa-mug-hot mr-2"></i> Local Spots</a></div> <div class="navbar-menu is-active"><div class="navbar-start">`);
    if (user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<a${attr_class(`navbar-item ${stringify(isActive("/dashboard"))}`, "svelte-rfuq4y")} href="/dashboard">Dashboard</a> <a${attr_class(`navbar-item ${stringify(isActive("/map"))}`, "svelte-rfuq4y")} href="/map">Global Map</a> <a${attr_class(`navbar-item ${stringify(isActive("/charts"))}`, "svelte-rfuq4y")} href="/charts">Analytics</a> <a${attr_class(`navbar-item ${stringify(isActive("/about"))}`, "svelte-rfuq4y")} href="/about">About</a> `);
      if (user.isAdmin) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a class="navbar-item admin-link svelte-rfuq4y" href="/admin">Admin Panel</a>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="navbar-end"><div class="navbar-item">`);
    if (user) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="field is-grouped is-align-items-center"><p class="control"><span class="tag is-coffee-light is-medium svelte-rfuq4y"><i class="fas fa-user-circle mr-2"></i> `);
      if (user?.firstName || user?.lastName) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`${escape_html(user.firstName)} ${escape_html(user.lastName)}`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`${escape_html(user?.email ?? "User")}`);
      }
      $$renderer2.push(`<!--]--></span></p> <div class="control"><form action="/logout" method="POST"><button class="button is-small is-danger is-light">Logout</button></form></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="buttons"><a class="button is-small is-light" href="/login">Log in</a> <a class="button is-small is-primary" href="/signup">Sign up</a></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  Navbar as N
};
