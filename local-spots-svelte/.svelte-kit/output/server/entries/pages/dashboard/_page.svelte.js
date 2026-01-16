import { U as ensure_array_like, V as attr } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { u as userState } from "../../../chunks/runes.svelte.js";
import { e as escape_html } from "../../../chunks/escaping.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    $$renderer2.push(`<section class="section"><div class="container"><h1 class="title mb-6 coffee-text svelte-x1i5gj">Dashboard</h1> <div class="columns"><div class="column is-one-third"><div class="box coffee-border svelte-x1i5gj"><h2 class="subtitle has-text-weight-bold coffee-text svelte-x1i5gj">Add New Spot</h2> <form method="POST" action="?/create" enctype="multipart/form-data"><div class="field"><label class="label" for="title">Spot Name</label> <div class="control"><input id="title" name="title" class="input" type="text" placeholder="e.g. Hidden Cafe" required/></div></div> <div class="field"><label class="label" for="category">Category</label> <div class="control"><div class="select is-fullwidth"><select id="category" name="category" required>`);
    $$renderer2.option({ value: "", disabled: true, selected: true }, ($$renderer3) => {
      $$renderer3.push(`Select Category...`);
    });
    $$renderer2.push(`<!--[-->`);
    const each_array = ensure_array_like(userState.categories);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let cat = each_array[$$index];
      $$renderer2.option({ value: cat._id }, ($$renderer3) => {
        $$renderer3.push(`${escape_html(cat.name)}`);
      });
    }
    $$renderer2.push(`<!--]--></select></div></div></div> <div class="field"><label class="label" for="description">Description</label> <div class="control"><textarea id="description" name="description" class="textarea" placeholder="Short description..." rows="2"></textarea></div></div> <div class="field is-grouped"><div class="control is-expanded"><label class="label is-small" for="latitude">Lat</label> <input id="latitude" name="latitude" class="input is-small" type="text" value="48.137154"/></div> <div class="control is-expanded"><label class="label is-small" for="longitude">Long</label> <input id="longitude" name="longitude" class="input is-small" type="text" value="11.576124"/></div></div> <div class="field"><label class="label" for="imagefile">Photo</label> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="file is-small is-info has-name is-fullwidth"><label class="file-label" for="imagefile"><input class="file-input" type="file" id="imagefile" name="imagefile" accept="image/*"/> <span class="file-cta coffee-btn svelte-x1i5gj"><span class="file-icon"><i class="fas fa-camera"></i></span> <span class="file-label">Choose Image</span></span> <span class="file-name">${escape_html("No file")}</span></label></div></div> <button class="button is-fullwidth mt-4 coffee-btn-main svelte-x1i5gj">Create Spot</button></form></div></div> <div class="column"><h2 class="subtitle has-text-weight-bold coffee-text svelte-x1i5gj">My Local Spots (${escape_html(userState.spots.length)})</h2> `);
    if (userState.spots.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="notification is-light">No spots found. Add one on the left!</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="fixed-grid has-1-cols-mobile has-2-cols-tablet has-2-cols-desktop"><div class="grid"><!--[-->`);
      const each_array_1 = ensure_array_like(userState.spots);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let spot = each_array_1[$$index_1];
        $$renderer2.push(`<div class="cell"><div class="card h-100 coffee-card svelte-x1i5gj">`);
        if (spot.img) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="card-image"><figure class="image is-4by3"><img${attr("src", spot.img)}${attr("alt", spot.title)} class="spot-img svelte-x1i5gj"/></figure></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="card-content"><div class="mb-2"><span class="tag is-coffee-tag is-rounded is-small svelte-x1i5gj"><i class="fas fa-tag mr-1"></i> ${escape_html(typeof spot.category === "object" ? spot.category?.name : "General")}</span></div> <p class="title is-5 coffee-text mb-2 svelte-x1i5gj">${escape_html(spot.title)}</p> <p class="content is-small has-text-grey">${escape_html(spot.description)}</p></div> <footer class="card-footer"><form method="POST" action="?/delete" class="card-footer-item p-0"><input type="hidden" name="id"${attr("value", spot._id)}/> <button class="button is-white is-fullwidth has-text-danger delete-btn svelte-x1i5gj"><i class="fas fa-trash-alt mr-2"></i> Delete</button></form></footer></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></section>`);
  });
}
export {
  _page as default
};
