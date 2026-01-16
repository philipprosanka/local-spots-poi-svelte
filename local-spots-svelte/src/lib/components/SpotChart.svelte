<script lang="ts">
  import { onMount } from 'svelte';
  // @ts-ignore
  import { Chart } from 'frappe-charts';
  import type { LocalSpot, Category } from '$lib/types/localspot-types';

  
  let { 
    spots = [], 
    categories = [] 
  }: { 
    spots: LocalSpot[], 
    categories: Category[] 
  } = $props();

  let chart: any;

  // Helper Funktion nutzt jetzt die Props (spots, categories) statt userState
  function getChartData() {
    const labels = categories.map((c) => c.name);
    
    const values = categories.map((c) => {
      return spots.filter((s) => {
        // Sicherer Zugriff auf die ID (falls populated Objekt oder String ID)
        const catId = typeof s.category === 'object' ? s.category?._id : s.category;
        return catId === c._id;
      }).length;
    });

    return {
      labels: labels,
      datasets: [{ values: values }]
    };
  }

  // Effect: Wenn sich die Props ändern, Chart updaten
  $effect(() => {
    // Wir prüfen auf 'chart' und ob 'spots' Daten hat
    if (chart && spots) {
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