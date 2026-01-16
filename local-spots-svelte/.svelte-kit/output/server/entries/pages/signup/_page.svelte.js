import { V as attr } from "../../../chunks/index2.js";
import { e as escape_html } from "../../../chunks/escaping.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { N as Navbar } from "../../../chunks/Navbar.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { form } = $$props;
    Navbar($$renderer2, {});
    $$renderer2.push(`<!----> <section class="section"><div class="container column is-4 is-offset-4"><div class="box"><h1 class="title has-text-centered">Sign Up</h1> <form method="POST"><div class="field"><div class="columns"><div class="column"><label class="label" for="firstName">First Name</label> <div class="control"><input id="firstName" name="firstName" class="input" type="text" required placeholder="Homer"/></div></div> <div class="column"><label class="label" for="lastName">Last Name</label> <div class="control"><input id="lastName" name="lastName" class="input" type="text" required placeholder="Simpson"/></div></div></div></div> <div class="field"><label class="label" for="email">Email</label> <div class="control"><input id="email" name="email" class="input" type="email" required placeholder="homer@simpson.com"${attr("value", form?.email ?? "")}/></div></div> <div class="field"><label class="label" for="password">Password</label> <div class="control"><input id="password" name="password" class="input" type="password" required/></div></div> `);
    if (form?.error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="notification is-danger is-light">${escape_html(form.error)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="field mt-5"><button class="button is-primary is-fullwidth">Registrieren</button></div></form> <p class="is-size-7 has-text-centered mt-4">Bereits ein Konto? <a href="/login">Hier einloggen</a></p></div></div></section>`);
  });
}
export {
  _page as default
};
