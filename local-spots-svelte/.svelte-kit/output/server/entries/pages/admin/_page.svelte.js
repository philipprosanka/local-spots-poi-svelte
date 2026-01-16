import { U as ensure_array_like, V as attr } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<section class="section"><div class="container"><h1 class="title">Admin Dashboard</h1> <div class="box"><table class="table is-fullwidth is-striped"><thead><tr><th>First Name</th><th>Last Name</th><th>Email</th><th>Admin?</th><th>Action</th></tr></thead><tbody><!--[-->`);
    const each_array = ensure_array_like(data.users);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let user = each_array[$$index];
      $$renderer2.push(`<tr><td>${escape_html(user.firstName)}</td><td>${escape_html(user.lastName)}</td><td>${escape_html(user.email)}</td><td>${escape_html(user.isAdmin ? "✅" : "")}</td><td>`);
      if (!user.isAdmin) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<form method="POST" action="?/deleteUser"><input type="hidden" name="id"${attr("value", user._id)}/> <button class="button is-small is-danger">Delete</button></form>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></section>`);
  });
}
export {
  _page as default
};
