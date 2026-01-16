import { e as escape_html } from "../../../chunks/escaping.js";
import "clsx";
import "frappe-charts";
import "jwt-decode";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
function SpotChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="box p-6" style="min-height: 550px; display: flex; flex-direction: column; justify-content: flex-start;"><div class="mb-6"><h3 class="title is-4 has-text-centered">My Spots by Category</h3> <hr style="width: 60px; margin: 12px auto; background-color: #8B4513; height: 3px; border: none; border-radius: 2px;"/></div> <div id="chart" class="chart-container svelte-1loq1hs" style="flex-grow: 1;"></div></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const mostPopularCategory = () => {
      if (!data.categories.length || !data.spots.length) return "N/A";
      const counts = {};
      data.spots.forEach((s) => {
        const catId = typeof s.category === "object" ? s.category?._id : s.category;
        if (catId) {
          counts[catId] = (counts[catId] || 0) + 1;
        }
      });
      let maxCount = -1;
      let popularId = "";
      for (const [id, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          popularId = id;
        }
      }
      const winner = data.categories.find((c) => c._id === popularId);
      return winner ? `${winner.name} (${maxCount})` : "N/A";
    };
    $$renderer2.push(`<nav class="level box"><div class="level-item has-text-centered"><div><p class="heading">Total Spots</p> <p class="title">${escape_html(data.spots.length)}</p></div></div> <div class="level-item has-text-centered"><div><p class="heading">Categories</p> <p class="title">${escape_html(data.categories.length)}</p></div></div> <div class="level-item has-text-centered"><div><p class="heading">Most Popular Category</p> <p class="title is-5">${escape_html(mostPopularCategory())}</p></div></div></nav> <section class="section"><div class="container"><h1 class="title">Data Analytics</h1> <h2 class="subtitle">Visualizing your private spots distribution</h2> <div class="columns is-centered"><div class="column is-8">`);
    SpotChart($$renderer2, { spots: data.spots, categories: data.categories });
    $$renderer2.push(`<!----></div></div> <div class="has-text-centered mt-5"><a href="/dashboard" class="button is-light">Back to Dashboard</a></div></div></section>`);
  });
}
export {
  _page as default
};
