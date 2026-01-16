<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import type { LocalSpot, Category } from '$lib/types/localspot-types';

  let { 
      spots = [], 
      categories = [],
      interactive = true, 
      height = "400px",
      title = "Map"
  }: {
      spots: LocalSpot[],
      categories: Category[],
      interactive?: boolean,
      height?: string,
      title?: string
  } = $props();

  let mapElement: HTMLElement;
  let map: any;
  let overlays: Record<string, any> = {};
  let layerControl: any;

  // Farbschema (Deine angepasste Version: Nature=Grün, Culture=Blau)
  const CATEGORY_HUES: Record<string, number> = {
      'Culture': 0,      // Blau (Original)
      'Nature': 270,     // Grün
      'Food & Drink': 160, 
      'Nightlife': 30,  
      'Sightseeing': 190, 
      'History': 320,  
      'Shopping': 200
  };

  $effect(() => {
    if (map && spots) {
      updateMarkers();
    }
  });

  function updateMarkers() {
    if (!map || !browser) return;
    const L = (window as any).L; 
    if (!L) return;

    // 1. Aufräumen
    Object.values(overlays).forEach(layer => layer.clearLayers());
    if (layerControl) {
        map.removeControl(layerControl);
        layerControl = null;
    }

    // 2. Overlays vorbereiten
    const activeCategories = new Set();
    categories.forEach(cat => {
         if (!overlays[cat.name]) {
            overlays[cat.name] = L.layerGroup().addTo(map); 
         }
    });

    // 3. Marker setzen
    // ... in updateMarkers() ...

    spots.forEach((spot) => {
      // FIX 1: "name" vs "title" Problem lösen
      // Wir casten kurz auf 'any', um zu prüfen, ob 'name' oder 'title' da ist.
      // Das beruhigt TypeScript.
      const spotName = (spot as any).name || (spot as any).title || 'Unknown Spot';

      const spotCatId = (typeof spot.category === 'object' && spot.category !== null) 
        ? spot.category._id 
        : spot.category;

      const catIndex = categories.findIndex((c) => c._id === spotCatId);
      const category = categories[catIndex];

      if (category && overlays[category.name]) {
        activeCategories.add(category.name);
        
        const hueShift = CATEGORY_HUES[category.name] !== undefined 
            ? CATEGORY_HUES[category.name] 
            : (catIndex * 137); 
        
        const marker = L.marker([spot.latitude, spot.longitude]);

        marker.on('add', (e: any) => {
           if(e.target._icon) e.target._icon.style.filter = `hue-rotate(${hueShift}deg)`;
        });

        // Popup mit der neuen Variable 'spotName' nutzen
        marker.bindPopup(`
            <div class="p-1">
                <strong class="is-size-6">${spotName}</strong><br>
                <span class="tag is-info is-light mb-1">${category.name}</span>
                <p class="is-size-7">${spot.description || ''}</p>
            </div>
        `);
        
        overlays[category.name].addLayer(marker);
      }
    });

    // 4. LAYER CONTROL & SATELLITE VIEW (Hier ist die Neuerung!)
    if (interactive) {
        // A. Basis Karten definieren
        const streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: '© OpenStreetMap' 
        });
        const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
            attribution: 'Tiles &copy; Esri' 
        });

        // WICHTIG: Damit 'streets' der Standard ist, müssen wir sicherstellen, dass es auf der Map liegt
        // Wir prüfen nicht, ob es schon drauf ist, sondern setzen das Control neu auf.
        // Das Base Layer Management übernimmt Leaflet.
        
        const baseMaps = {
            "Map View": streets,
            "Satellite": satellite
        };

        // B. Kategorien (Overlays) sammeln
        const overlayMaps: Record<string, any> = {};
        categories.forEach(cat => {
            if (activeCategories.has(cat.name)) {
                overlayMaps[`<span style="font-weight:600">${cat.name}</span>`] = overlays[cat.name];
            }
        });

        // C. Control erstellen (Base + Overlays)
        layerControl = L.control.layers(baseMaps, overlayMaps, { collapsed: true }).addTo(map);
    }

    // 5. Auto-Zoom
    const allMarkers = Object.values(overlays).flatMap(layer => layer.getLayers());
    if (allMarkers.length > 0) {
      map.fitBounds(L.featureGroup(allMarkers).getBounds(), { padding: [30, 30] });
    }
  }

  onMount(async () => {
    if (browser) {
        const L = await import('leaflet');
        (window as any).L = L;

        // Icon Fix
        if (!(L.Icon.Default.prototype as any)._getIconUrl_Fixed) {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
            (L.Icon.Default.prototype as any)._getIconUrl_Fixed = true;
        }

        // Init Map
        map = L.map(mapElement, {
            center: [48.137, 11.576],
            zoom: 13,
            // Zoom Controls jetzt immer anzeigen, wenn interactive=true
            zoomControl: interactive, 
            dragging: interactive,
            scrollWheelZoom: interactive && 'center', 
            doubleClickZoom: interactive,
            boxZoom: interactive,
            keyboard: interactive
        });

        // Standard Layer setzen (Streets)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

        updateMarkers();
    }
  });

  onDestroy(() => {
    if (map) map.remove();
  });
</script>

<div class="map-wrapper box p-0">
    <div bind:this={mapElement} style="height: {height}; width: 100%;"></div>
    
    {#if !interactive}
        <div class="static-overlay"></div>
    {/if}
</div>

<style>
    .map-wrapper {
        border-radius: 8px; 
        border: 1px solid #dbdbdb; 
        overflow: hidden;
        position: relative;
        z-index: 1;
    }
    .static-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 1000;
        cursor: default;
    }
    /* Layer Control Styling */
    :global(.leaflet-control-layers) {
        border: none !important;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
        border-radius: 6px !important;
        font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
</style>