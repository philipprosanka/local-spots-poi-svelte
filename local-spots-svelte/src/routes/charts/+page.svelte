<script lang="ts">
  import Chart from '$lib/components/SpotChart.svelte'; 
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();


  let legendItems = $derived(data.charts.categoryLabels.map((label: string, index: number) => {
      return {
          label: label,
          color: data.charts.categoryColors[index] || '#ccc' // Fallback Farbe
      };
  }));
</script>

<section class="section">
  <div class="container">
    <div class="mb-6 has-text-centered">
        <h1 class="title is-2 coffee-text">Analytics Dashboard</h1>
        <p class="subtitle">Visualizing {data.totalSpots} spots across your network</p>
    </div>

    <div class="columns mb-6">
        <div class="column is-full">
            <h3 class="title is-5 ml-2">Total Growth (Cumulative)</h3>
            
            {#if data.charts.trendValues.length > 0}
                <Chart 
                    type="line" 
                    title="Total Spots over Time"
                    labels={data.charts.trendLabels} 
                    values={data.charts.trendValues}
                    colors={['#6F4E37']} 
                />
            {:else}
                <div class="notification is-light has-text-centered py-6">
                    <span class="icon is-large has-text-grey-light mb-3">
                        <i class="fas fa-chart-line fa-3x"></i>
                    </span>
                    <p class="is-size-5">No active timeline data yet.</p>
                </div>
            {/if}
        </div>
    </div>

    {#if legendItems.length > 0}
        <div class="box mb-5 legend-box">
            <h6 class="title is-6 mb-3 is-size-7 has-text-grey has-text-centered">CATEGORY LEGEND</h6>
            <div class="legend-container">
                {#each legendItems as item}
                    <div class="legend-item">
                        <span class="legend-dot" style="background-color: {item.color};"></span>
                        <span class="legend-label">{item.label}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <div class="columns">
        
        <div class="column is-6">
            <h3 class="title is-5 ml-2">Spots by Category (Comparison)</h3>
            
            {#if data.charts.categoryValues.length > 0}
                <Chart 
                    type="bar" 
                    labels={data.charts.categoryLabels} 
                    values={data.charts.categoryValues}
                    colors={data.charts.categoryColors} 
                />
            {:else}
                <div class="box has-text-centered has-background-light py-6" style="height: 320px;">
                    <p class="mt-6 has-text-grey">No categories found.</p>
                </div>
            {/if}
        </div>

        <div class="column is-6">
            <h3 class="title is-5 ml-2">Category Share</h3>
            
            {#if data.charts.categoryValues.length > 0}
                <Chart 
                    type="pie" 
                    labels={data.charts.categoryLabels} 
                    values={data.charts.categoryValues}
                    colors={data.charts.categoryColors}
                />
            {:else}
                <div class="box has-text-centered has-background-light py-6" style="height: 320px;">
                    <p class="mt-6 has-text-grey">No data to display.</p>
                </div>
            {/if}
        </div>
    </div>
      
    <div class="has-text-centered mt-6">
      <a href="/dashboard" class="button is-primary is-outlined">Back to Dashboard</a>
    </div>
  </div>
</section>

<style>
    .coffee-text { color: #6F4E37; }

    /* LEGENDE STYLING - WICHTIG DAMIT PUNKTE SICHTBAR SIND */
    .legend-box {
        padding: 1rem;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        max-width: 800px;
        margin: 0 auto 2rem auto; /* Zentriert die Box */
    }

    .legend-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        font-weight: 500;
        color: #4a4a4a;
    }

    
    .legend-dot {
        width: 12px;       
        height: 12px;      
        border-radius: 50%; 
        margin-right: 8px;
        display: inline-block; 
        box-shadow: 0 0 2px rgba(0,0,0,0.2);
        flex-shrink: 0;    
    }
</style>