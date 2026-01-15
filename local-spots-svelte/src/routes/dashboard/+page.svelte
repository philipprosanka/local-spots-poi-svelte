<script lang="ts">
  import { onMount } from 'svelte';
  import { localSpotService } from "$lib/services/localspot-service";
  import type { LocalSpot, Category } from "$lib/types/localspot-types";
  import { userState } from "$lib/runes.svelte";
  // WICHTIG: Navbar importieren
  import Navbar from "$lib/components/Navbar.svelte";
  // Auth importieren für Check
  import { auth } from "$lib/runes.svelte"; 
  import { goto } from "$app/navigation";
  import { page } from '$app/stores';

  // --- Form State Variables ---
  let title = $state("");
  let description = $state("");
  let selectedCategory = $state(""); 
  let latitude = $state(48.137154); 
  let longitude = $state(11.576124);
  let fileInput = $state<FileList | null>(null);
  let imagePreviewUrl = $state<string | ArrayBuffer | null>(null);

  let isLoading = $state(true);

  onMount(async () => {
    // Token Check (falls Redirect von Google)
    const token = $page.url.searchParams.get('token');
    if (token) {
      auth.login(token);
      goto('/dashboard', { replaceState: true });
    }

    if (!auth.isLoggedIn) {
       goto("/login");
       return;
    }

    try {
      await userState.refresh();
    } catch (error) {
      console.error("Error loading private data:", error);
    } finally {
      isLoading = false;
    }
  });

  function handleFileChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
          fileInput = target.files;
          const reader = new FileReader();
          reader.onload = (evt) => imagePreviewUrl = evt.target?.result || null;
          reader.readAsDataURL(target.files[0]);
      }
  }

  async function createSpot() {
    if (!selectedCategory || !title) return;
    try {
      const spotData: Partial<LocalSpot> = { title, description, category: selectedCategory, latitude, longitude };
      const file = (fileInput && fileInput.length > 0) ? fileInput[0] : null;
      
      const newSpot = await localSpotService.createSpotWithImage(spotData, file);
      
      userState.spots = [...userState.spots, newSpot];
      resetForm(); 
    } catch (err: any) {
      alert("Failed to create spot");
    }
  }

  async function deleteSpot(id: string) {
    userState.spots = userState.spots.filter(s => s._id !== id);
    try {
      await localSpotService.deleteSpot(id);
    } catch (err) {
      await userState.refresh(); 
      alert("Delete failed on server");
    }
  }

  function resetForm() {
    title = ""; description = ""; selectedCategory = "";
    fileInput = null; imagePreviewUrl = null;
    latitude = 48.137154; longitude = 11.576124;
  }
</script>

<Navbar />

<section class="section">
  <div class="container">
    <h1 class="title mb-6 coffee-text">Dashboard</h1>

    <div class="columns">
      <div class="column is-one-third">
        <div class="box coffee-border">
          <h2 class="subtitle has-text-weight-bold coffee-text">Add New Spot</h2>
          
          <form onsubmit={(e) => { e.preventDefault(); createSpot(); }}>
            <div class="field">
              <label class="label" for="title">Spot Name</label>
              <div class="control">
                <input id="title" class="input" type="text" bind:value={title} placeholder="e.g. Hidden Cafe" required />
              </div>
            </div>

            <div class="field">
              <label class="label" for="category">Category</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="category" bind:value={selectedCategory} required>
                    <option value="" disabled selected>Select Category...</option>
                    {#each userState.categories as cat}
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
                <label class="label is-small" for="latitude-input">Lat</label>
                <input id="latitude-input" class="input is-small" type="number" step="any" bind:value={latitude}>
              </div>
              <div class="control is-expanded">
                <label class="label is-small" for="longitude-input">Long</label>
                <input id="longitude-input" class="input is-small" type="number" step="any" bind:value={longitude}>
              </div>
            </div>

            <div class="field">
              <label class="label">Photo</label>
              {#if imagePreviewUrl}
                <figure class="image is-128x128 mb-2">
                  <img src={imagePreviewUrl.toString()} alt="Preview" class="rounded-img">
                </figure>
              {/if}
              <div class="file is-small is-info has-name is-fullwidth">
                <label class="file-label">
                  <input class="file-input" type="file" accept="image/*" onchange={handleFileChange}>
                  <span class="file-cta coffee-btn">
                    <span class="file-icon"><i class="fas fa-camera"></i></span>
                    <span class="file-label">Choose Image</span>
                  </span>
                  <span class="file-name">{fileInput ? fileInput[0].name : "No file"}</span>
                </label>
              </div>
            </div>

            <button class="button is-fullwidth mt-4 coffee-btn-main">Create Spot</button>
          </form>
        </div>
      </div>

      <div class="column">
        <h2 class="subtitle has-text-weight-bold coffee-text">My Local Spots ({userState.spots.length})</h2>
        
        {#if isLoading}
            <progress class="progress is-small is-primary" max="100">15%</progress>
        {:else if userState.spots.length === 0}
            <div class="notification is-light">No spots found. Add one on the left!</div>
        {:else}
            <div class="fixed-grid has-1-cols-mobile has-2-cols-tablet has-2-cols-desktop">
                <div class="grid">
                    {#each userState.spots as spot (spot._id)}
                      <div class="cell">
                        <div class="card h-100 coffee-card">
                          {#if spot.img}
                            <div class="card-image">
                              <figure class="image is-4by3">
                                <img src={spot.img} alt={spot.title} class="spot-img">
                              </figure>
                            </div>
                          {/if}
                          
                          <div class="card-content">
                            <div class="mb-2">
                              <span class="tag is-coffee-tag is-rounded is-small">
                                <i class="fas fa-tag mr-1"></i>
                                {typeof spot.category === 'object' ? spot.category?.name : 'General'}
                              </span>
                            </div>

                            <p class="title is-5 coffee-text mb-2">{spot.title}</p>
                            <p class="content is-small has-text-grey">{spot.description}</p>
                            
                            <div class="is-flex is-align-items-center mt-3">
                                <span class="icon is-small has-text-grey-light mr-1"><i class="fas fa-location-arrow"></i></span>
                                <span class="is-size-7 has-text-grey-light">
                                    {spot.latitude.toFixed(3)}, {spot.longitude.toFixed(3)}
                                </span>
                            </div>
                          </div>

                          <footer class="card-footer">
                            <button class="card-footer-item delete-btn" onclick={() => deleteSpot(spot._id)}>
                              <i class="fas fa-trash-alt mr-2"></i> Delete
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
  .coffee-text { color: #6F4E37; }
  .coffee-border { border-top: 4px solid #6F4E37; }
  .coffee-btn { background-color: #A67B5B !important; border: none; }
  .coffee-btn-main { background-color: #6F4E37 !important; color: white !important; font-weight: bold; }
  .coffee-card { border-radius: 8px; overflow: hidden; border-bottom: 2px solid #D2B48C; }
  .rounded-img { border-radius: 8px; object-fit: cover; }
  .h-100 { height: 100%; }

  .coffee-card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
    overflow: hidden;
  }
  .coffee-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(111, 78, 55, 0.15);
  }
  .spot-img {
    object-fit: cover;
    transition: scale 0.3s ease;
  }
  .coffee-card:hover .spot-img {
    scale: 1.05;
  }
  .is-coffee-tag {
    background-color: #6F4E37;
    color: white;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .delete-btn {
    color: #ff3860;
    font-weight: 600;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .delete-btn:hover {
    background-color: #fff5f7;
    color: #cc0f35;
  }
</style>