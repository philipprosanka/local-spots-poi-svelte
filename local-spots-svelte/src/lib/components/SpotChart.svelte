<script lang="ts">
  import { onMount } from 'svelte';
  // @ts-ignore
  import { Chart } from 'frappe-charts';
  import type { LocalSpot, Category } from '$lib/types/localspot-types';

  let { spots, categories } = $props();
  let chart: any;

 
  function getChartData() {
    // 1. Tell TS that 'c' is a Category
    const labels = categories.map((c: Category) => c.name);
    
    // 2. Tell TS that 'c' is a Category and 's' is a LocalSpot
    const values = categories.map((c: Category) => {
      return spots.filter((s: LocalSpot) => {
        // Handle both populated object or string ID
        const catId = typeof s.category === 'object' ? s.category?._id : s.category;
        return catId === c._id;
      }).length;
    });

    return {
      labels: labels,
      datasets: [{ values: values }]
    };
  }

  onMount(() => {
    chart = new Chart("#chart", {
      title: "Spots Distribution by Category",
      data: getChartData(),
      type: 'pie', // Pie looks great on a dedicated analytics page
      height: 400,
      colors: ['#8B4513', '#D2B48C', '#DEB887', '#F5DEB3'] // A brown-toned palette
    });
  });
</script>

<style>
  /* This ensures the chart container expands to fill the Bulma column */
  .chart-container {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
  }
</style>

<div class="box chart-container">
  <div id="chart"></div>
</div>
