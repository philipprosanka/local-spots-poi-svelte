<script lang="ts">
  import { onMount } from 'svelte';
  import { localSpotService } from "$lib/services/localspot-service";
  import type { LocalSpot, Category } from "$lib/types/localspot-types";
  import SpotChart from "$lib/components/SpotChart.svelte";

  // --- State Variables ---
  let title = $state("");
  let description = $state("");
  let selectedCategory = $state(""); // This stores the ID string
  let latitude = $state(48.137154); 
  let longitude = $state(11.576124);
  
  let fileInput = $state<FileList | null>(null);
  let imagePreviewUrl = $state<string | ArrayBuffer | null>(null);

  let categories = $state<Category[]>([]);
  let spots = $state<LocalSpot[]>([]);
  let isLoading = $state(true);

  // --- Load Data ---
  onMount(async () => {
    try {
      const [catData, spotData] = await Promise.all([
        localSpotService.getCategories(),
        localSpotService.getAllSpots()
      ]);
      categories = catData;
      spots = spotData;
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      isLoading = false;
    }
  });

  // --- Image Preview Helper ---
  function handleFileChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
          fileInput = target.files;
          const reader = new FileReader();
          reader.onload = (evt) => imagePreviewUrl = evt.target?.result || null;
          reader.readAsDataURL(target.files[0]);
      }
  }

  // --- Create Action ---
  async function createSpot() {
    if (!selectedCategory) return alert("Please select a category.");

    try {
      // 1. Prepare Data (matches Partial<LocalSpot>)
      const spotData: Partial<LocalSpot> = {
        title: title,
        description: description,
        category: selectedCategory, // Sending the ID string here
        latitude: latitude,
        longitude: longitude
      };

      // 2. Get File
      const file = (fileInput && fileInput.length > 0) ? fileInput[0] : null;

      // 3. Use Service to handle the 2-step process
      const newSpot = await localSpotService.createSpotWithImage(spotData, file);

      // 4. Update List & Reset
      spots = [...spots, newSpot];
      alert("Spot created!");
      resetForm();

    } catch (err: any) {
      console.error(err);
      alert("Error: " + (err.message || "Failed to create spot"));
    }
  }

  // --- Delete Action ---
  async function deleteSpot(id: string) {
    if(!confirm("Delete this spot?")) return;
    try {
      await localSpotService.deleteSpot(id);
      spots = spots.filter(s => s._id !== id);
    } catch (err) {
      alert("Delete failed");
    }
  }

  function resetForm() {
    title = ""; description = ""; selectedCategory = "";
    fileInput = null; imagePreviewUrl = null;
  }
</script>

<section class="section">
  <div class="container">
    <h1 class="title mb-6">Dashboard</h1>

    <div class="columns">
      
      <div class="column is-one-third">
        <div class="box">
          <h2 class="subtitle has-text-weight-bold">Add New Spot</h2>
          
          <form onsubmit={(e) => { e.preventDefault(); createSpot(); }}>
            
            <div class="field">
              <label class="label" for="title">Name</label>
              <div class="control">
                <input id="title" class="input" type="text" bind:value={title} placeholder="Spot Name" required />
              </div>
            </div>

            <div class="field">
              <label class="label" for="category">Category</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="category" bind:value={selectedCategory} required>
                    <option value="" disabled selected>Select Category...</option>
                    {#each categories as cat}
                      <option value={cat._id}>{cat.name}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
                <label class="label" for="desc">Description</label>
                <div class="control">
                  <textarea id="desc" class="textarea" bind:value={description} placeholder="Short description..." rows="2"></textarea>
                </div>
            </div>

            <div class="field is-grouped">
                <div class="control is-expanded">
                    <input class="input" type="number" step="any" bind:value={latitude} placeholder="Lat">
                </div>
                <div class="control is-expanded">
                    <input class="input" type="number" step="any" bind:value={longitude} placeholder="Long">
                </div>
            </div>

            <div class="field">
              {#if imagePreviewUrl}
                  <figure class="image is-128x128 mb-2">
                      <img src={imagePreviewUrl.toString()} alt="Preview" class="is-rounded">
                  </figure>
              {/if}
              <div class="file is-small is-info has-name">
                <label class="file-label">
                  <input class="file-input" type="file" accept="image/*" onchange={handleFileChange}>
                  <span class="file-cta">
                    <span class="file-icon"><i class="fas fa-upload"></i></span>
                    <span class="file-label">Image..</span>
                  </span>
                  <span class="file-name">
                    {fileInput ? fileInput[0].name : "No file"}
                  </span>
                </label>
              </div>
            </div>

            <button class="button is-link is-fullwidth mt-4">Create Spot</button>
          </form>
        </div>
      </div>

      <div class="column">
        <h2 class="subtitle has-text-weight-bold">My Local Spots ({spots.length})</h2>
        
        {#if isLoading}
            <progress class="progress is-small is-primary" max="100">15%</progress>
        {:else if spots.length === 0}
            <div class="notification is-light">
                No spots found. Add one on the left!
            </div>
        {:else}
            <div class="fixed-grid has-1-cols-mobile has-2-cols-tablet has-2-cols-desktop">
                <div class="grid">
                    {#each spots as spot (spot._id)}
                        <div class="cell">
                            <div class="card h-100">
                                {#if spot.img}
                                    <div class="card-image">
                                        <figure class="image is-4by3">
                                            <img src={spot.img} alt={spot.title}>
                                        </figure>
                                    </div>
                                {/if}
                                <div class="card-content">
                                    <div class="media mb-2">
                                        <div class="media-content">
                                            <p class="title is-5">{spot.title}</p>
                                            <p class="subtitle is-7 has-text-grey">
                                                Lat: {spot.latitude.toFixed(4)}, Long: {spot.longitude.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="content is-small">
                                        {spot.description}
                                    </div>
                                </div>
                                <footer class="card-footer">
                                    <button class="card-footer-item has-text-danger" onclick={() => deleteSpot(spot._id)}>
                                        Delete
                                    </button>
                                </footer>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
      </div>

    </div>
  </div>
</section>

<style>
    /* Optional: Ensure cards have equal height if using grid */
    .h-100 { height: 100%; }
</style>