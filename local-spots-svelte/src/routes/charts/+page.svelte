<script lang="ts">
  import { onMount } from 'svelte';
  import SpotChart from '$lib/components/SpotChart.svelte';
  import { auth, userState } from "$lib/runes.svelte";
  import { goto } from "$app/navigation";

  let isLoading = $state(true);

  onMount(async () => {
    // Check if user is logged in
    if (!auth.isAuthenticated) {
      goto("/login");
      return;
    }

    try {
      // Refresh global state to get latest private data
      await userState.refresh();
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      isLoading = false;
    }
  });

  // Derived state now points to userState for privacy
  // Derived state for popular category
  const mostPopularCategory = $derived(() => {
    if (userState.categories.length === 0 || userState.spots.length === 0) return "N/A";

    const counts: Record<string, number> = {};
    
    userState.spots.forEach(s => {
      // Handle both populated object and string ID
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

    const winner = userState.categories.find(c => c._id === popularId);
    return winner ? `${winner.name} (${maxCount})` : "N/A";
  });
</script>

<nav class="level box">
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Total Spots</p>
      <p class="title">{userState.spots.length}</p>
    </div>
  </div>
  <div class="level-item has-text-centered">
    <div>
      <p class="heading">Categories</p>
      <p class="title">{userState.categories.length}</p>
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

    {#if isLoading}
      <progress class="progress is-small is-primary" max="100">Loading</progress>
    {:else}
      <div class="columns is-centered">
        <div class="column is-8">
          <SpotChart spots={userState.spots} categories={userState.categories} />
        </div>
      </div>
      
      <div class="has-text-centered mt-5">
        <a href="/dashboard" class="button is-light">Back to Dashboard</a>
      </div>
    {/if}
  </div>
</section>