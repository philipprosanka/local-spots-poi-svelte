<script lang="ts">
  import { onMount } from 'svelte';
  import { localSpotService } from "$lib/services/localspot-service";
  import SpotChart from '$lib/components/SpotChart.svelte';
  import type { LocalSpot, Category } from "$lib/types/localspot-types";
  import { auth } from "$lib/runes.svelte";
  import { goto } from "$app/navigation";

  let spots = $state<LocalSpot[]>([]);
  let categories = $state<Category[]>([]);
  let isLoading = $state(true);

  onMount(async () => {

    if (!auth.token) {
      goto("/login");
      return;
    }

    try {
      const [catData, spotData] = await Promise.all([
        localSpotService.getCategories(),
        localSpotService.getAllSpots()
      ]);
      categories = catData;
      spots = spotData;
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      isLoading = false;
    }
  });

  // Find the category with the highest count of spots
  let mostPopularCategory = $derived(() => {
    if (categories.length === 0 || spots.length === 0) return "N/A";

    // 1. Create a map of counts per category ID
    const counts: Record<string, number> = {};
    
    spots.forEach(s => {
      const catId = typeof s.category === 'object' ? s.category?._id : s.category;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
      }
    });

    // 2. Find the ID with the maximum value
    let maxCount = -1;
    let popularId = "";

    for (const [id, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        popularId = id;
      }
    }

    // 3. Find the name of that category
    const winner = categories.find(c => c._id === popularId);
    return winner ? `${winner.name} (${maxCount})` : "N/A";
  });
</script>


<nav class="level box">
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Total Spots</p>
      <p class="title">{spots.length}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Categories</p>
      <p class="title">{categories.length}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div class="level-item has-text-centered">
  <div>
    <p class="heading">Most Popular Category</p>
    <p class="title is-5">{mostPopularCategory()}</p>
  </div>
</div>
  </div>
</nav>

<section class="section">
  <div class="container">
    <h1 class="title">Data Analytics</h1>
    <h2 class="subtitle">Visualizing your local spots distribution</h2>

    {#if isLoading}
      <progress class="progress is-small is-primary" max="100">Loading</progress>
    {:else}
      <div class="columns is-centered">
        <div class="column is-8">
          <SpotChart {spots} {categories} />
        </div>
      </div>
      
      <div class="has-text-centered mt-5">
        <a href="/dashboard" class="button is-light">Back to Dashboard</a>
      </div>
    {/if}
  </div>
</section>