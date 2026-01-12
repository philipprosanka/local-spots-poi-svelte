<script lang="ts">
  import { onMount } from 'svelte';
  // @ts-ignore
  import { Chart } from 'frappe-charts';
  import type { LocalSpot, Category } from '$lib/types/localspot-types';
  import { userState } from "$lib/runes.svelte"; // Import the private global state

  let chart: any;

  // We use a helper to format the data for Frappe Charts
  function getChartData() {
    const labels = userState.categories.map((c: Category) => c.name);
    const values = userState.categories.map((c: Category) => {
      return userState.spots.filter((s: LocalSpot) => {
        const catId = typeof s.category === 'object' ? s.category?._id : s.category;
        return catId === c._id;
      }).length;
    });

    return {
      labels: labels,
      datasets: [{ values: values }]
    };
  }

  // This Effect ensures the chart re-draws whenever userState changes
  $effect(() => {
    if (chart && userState.spots) {
      chart.update(getChartData());
    }
  });

  onMount(() => {
    chart = new Chart("#chart", {
      data: getChartData(),
      type: 'pie',
      height: 400,
      colors: ['#8B4513', '#D2B48C', '#DEB887', '#F5DEB3']
    });
  });
</script>

<div class="box p-6" style="min-height: 550px; display: flex; flex-direction: column; justify-content: flex-start;">
  
  <div class="mb-6">
    <h3 class="title is-4 has-text-centered">My Spots by Category</h3>
    <hr style="width: 60px; margin: 12px auto; background-color: #8B4513; height: 3px; border: none; border-radius: 2px;">
  </div>

  <div id="chart" class="chart-container" style="flex-grow: 1;"></div>
</div>

<style>
  .chart-container {
    width: 100%;
    max-width: 100%;
    overflow: visible; 
  }
</style>