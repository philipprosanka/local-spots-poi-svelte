<script lang="ts">
  import { onMount } from 'svelte';
  // @ts-ignore
  import { Chart } from 'frappe-charts';

  let { 
      type = 'bar', 
      title = '', 
      labels = [], 
      values = [],
      colors = [] 
  }: { 
      type?: string,
      title?: string,
      labels: string[], 
      values: number[],
      colors?: string[]
  } = $props();

  let chartElement: HTMLElement;
  let chartInstance: any;
  let styleElement: HTMLStyleElement; 

  const chartId = 'chart-' + Math.random().toString(36).substr(2, 9);
  const DEFAULT_COLORS = ['#6F4E37', '#A67B5B', '#2E8B57', '#D2691E'];

  function getChartColors() {
      if (colors && colors.length > 0) return colors;
      return DEFAULT_COLORS;
  }

  function getData() {
    
    if (type === 'bar' && colors.length > 0) {
        const datasets = values.map((val, index) => {
            const dataArray = new Array(values.length).fill(0);
            dataArray[index] = val;
            return { values: dataArray };
        });
        return { labels, datasets };
    }
    
    return { labels, datasets: [{ values }] };
  }

  
  function updateDynamicCSS() {
      if (type !== 'bar' || !chartElement) return;

      const currentColors = getChartColors();
      const cssRules = currentColors.map((color, index) => {
          const i = index + 1;
          
          return `
            #${chartId} .frappe-chart .dataset-0 .data-point:nth-of-type(${i}) rect,
            #${chartId} .frappe-chart .dataset-0 .data-point:nth-of-type(${i}) .bar-mini,
            #${chartId} .frappe-chart .dataset-0 rect.bar-mini:nth-of-type(${i}) {
                fill: ${color} !important;
                opacity: 1 !important;
            }
          `;
      }).join(' ');

      
      if (!styleElement) {
          styleElement = document.createElement('style');
          chartElement.appendChild(styleElement);
      }
      styleElement.textContent = cssRules;
  }

  $effect(() => {
    if (chartInstance && values.length > 0) {
        chartInstance.update({
            data: getData(),
            colors: getChartColors()
        });
        updateDynamicCSS();
    }
  });

  onMount(() => {
    if (!labels || labels.length === 0) return;

    const isBarWithColors = type === 'bar' && colors.length > 0;

    chartInstance = new Chart(chartElement, {
      title: "", 
      data: getData(),
      type: type, 
      height: 250, 
      colors: getChartColors(),
      animate: 0, 
      axisOptions: { xAxisMode: 'tick', xIsSeries: true },
      barOptions: { 
          spaceRatio: 0.2,
          stacked: isBarWithColors ? 1 : 0 
      }, 
      lineOptions: { regionFill: 1, hideDots: 0 },
      
      tooltipOptions: {
        formatTooltipX: (d: any) => (d + '').toUpperCase(),
        formatTooltipY: (d: any) => d + ' Spots',
      }
    });

    updateDynamicCSS();
  });
</script>

<div class="box chart-container" id={chartId}>
    {#if title}
        <h4 class="title is-5 has-text-centered mb-4 coffee-text">{title}</h4>
    {/if}

    <div bind:this={chartElement}></div>
</div>

<style>
    .chart-container {
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        background: white;
        padding: 1.5rem;
    }
    .coffee-text { color: #6F4E37; }

    :global(.frappe-chart .rect-fill) {
        fill-opacity: 1 !important;
    }
    
    :global(.frappe-chart .chart-legend) {
        display: none !important;
    }
</style>