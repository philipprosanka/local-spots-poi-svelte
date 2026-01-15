<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { LocalSpot, Category } from '$lib/types/localspot-types';
  import { userState } from "$lib/runes.svelte"; // Import the private global state

  let mapElement: HTMLElement;
  let map: any;
  let overlays: Record<string, any> = {};

  // This Effect keeps the map markers in sync with the private userState
  $effect(() => {
    if (map && userState.spots) {
      updateMarkers();
    }
  });

  function updateMarkers() {
    const L = (window as any).L;
    if (!L || !map) return;

    // Clear existing markers from all layers
    Object.values(overlays).forEach(layer => layer.clearLayers());

    // Add private spots to Category Layers
    userState.spots.forEach((spot: LocalSpot) => {
      const spotCatId = (typeof spot.category === 'object' && spot.category !== null) 
        ? spot.category._id 
        : spot.category;

      const catIndex = userState.categories.findIndex((c: Category) => c._id === spotCatId);
      const category = userState.categories[catIndex];

      if (category && overlays[category.name]) {
        const hueShift = catIndex * 137; 
        const marker = L.marker([spot.latitude, spot.longitude]);
        
        marker.on('add', (e: any) => {
          e.target._icon.style.filter = `hue-rotate(${hueShift}deg)`;
        });

        marker.bindPopup(`
          <div class="p-1">
            <strong class="is-size-6">${spot.title}</strong><br>
            <span class="tag is-info is-light mb-1">${category.name}</span><br>
            <p class="is-size-7">${spot.description}</p>
          </div>
        `);
        
        overlays[category.name].addLayer(marker);
      }
    });
  }

  onMount(async () => {
    const L = await import('leaflet');
    import('leaflet/dist/leaflet.css');
    (window as any).L = L; // Make L available for the updateMarkers function

    // 1. Configure Default Marker Icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // 2. Define Base Tile Layers
    const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' });
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });

    // 3. Initialize Map
    map = L.map(mapElement, {
      center: [48.137, 11.576],
      zoom: 13,
      layers: [streets]
    });

    // 4. Create Category Overlays
    userState.categories.forEach((cat: Category) => {
      overlays[cat.name] = L.layerGroup().addTo(map);
    });

    // 5. Initial Marker Load
    updateMarkers();

    // 6. Layer Control
    L.control.layers({ "Standard Streets": streets, "Satellite View": satellite }, overlays, { collapsed: false }).addTo(map);

    // 7. Initial Auto-zoom
    const allMarkers = Object.values(overlays).flatMap(layer => layer.getLayers());
    if (allMarkers.length > 0) {
      map.fitBounds(L.featureGroup(allMarkers).getBounds(), { padding: [50, 50] });
    }
  });

  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="box p-0" style="overflow: hidden; border-radius: 8px; border: 1px solid #dbdbdb;">
  <div bind:this={mapElement} style="height: 600px; width: 100%;"></div>
</div>

<div class="box mt-4">
  <h3 class="subtitle is-6 has-text-weight-bold">Map Legend (Private Data)</h3>
  <div class="is-flex is-flex-wrap-wrap">
    {#each userState.categories as cat, i}
      <div class="mr-4 mb-2 is-flex is-align-items-center">
        <span class="mr-2" style="display:inline-block; width:15px; height:15px; background-color: #3884ff; filter: hue-rotate({i * 137}deg); border-radius: 50%; border: 1px solid white; box-shadow: 0 0 2px rgba(0,0,0,0.3);"></span>
        <span class="is-size-7">{cat.name}</span>
      </div>
    {/each}
  </div>
</div>