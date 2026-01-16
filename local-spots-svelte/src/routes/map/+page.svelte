<script lang="ts">
  import SpotMap from '$lib/components/SpotMap.svelte';
  import { userState } from "$lib/runes.svelte";
  
  // Daten vom Server empfangen
  let { data } = $props();

  // Sync mit globalem State für die Map-Komponente
  $effect(() => {
    if (data.spots) userState.spots = data.spots;
    if (data.categories) userState.categories = data.categories;
  });
</script>

<section class="section">
  <div class="container">
    <div class="level">
      <div class="level-left">
        <h1 class="title">My Global Map</h1>
      </div>
      <div class="level-right">
        <p class="has-text-grey">Showing {data.spots.length} private spots.</p>
      </div>
    </div>

    <SpotMap /> 
    
  </div>
</section>