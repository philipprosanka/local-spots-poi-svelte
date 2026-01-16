<script lang="ts">
  import SpotChart from '$lib/components/SpotChart.svelte';
  import type { PageData } from './$types';

  // 1. Daten empfangen
  let { data }: { data: PageData } = $props();

  // 2. Berechnung der beliebtesten Kategorie (direkt aus den Props)
  const mostPopularCategory = $derived(() => {
    if (!data.categories.length || !data.spots.length) return "N/A";

    const counts: Record<string, number> = {};
    
    data.spots.forEach((s: any) => {
      // Backend liefert manchmal Objekte, manchmal IDs
      const catId = typeof s.category === 'object' ? s.category?._id : s.category;
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

    const winner = data.categories.find((c: any) => c._id === popularId);
    return winner ? `${winner.name} (${maxCount})` : "N/A";
  });
</script>

<nav class="level box">
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Total Spots</p>
      <p class="title">{data.spots.length}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Categories</p>
      <p class="title">{data.categories.length}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Most Popular Category</p>
      <p class="title is-5">{mostPopularCategory()}</p>
    </div>
  </div>
</nav>

<section class="section">
  <div class="container">
    <h1 class="title">Data Analytics</h1>
    <h2 class="subtitle">Visualizing your private spots distribution</h2>

    <div class="columns is-centered">
      <div class="column is-8">
        <SpotChart spots={data.spots} categories={data.categories} />
      </div>
    </div>
      
    <div class="has-text-centered mt-5">
      <a href="/dashboard" class="button is-light">Back to Dashboard</a>
    </div>
  </div>
</section>