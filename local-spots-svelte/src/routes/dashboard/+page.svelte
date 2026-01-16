<script lang="ts">
  import { enhance } from '$app/forms';
  import { userState } from "$lib/runes.svelte";
  import type { PageData } from './$types';

  // Daten vom Server empfangen
  let { data }: { data: PageData } = $props();

  // FIX: Hier darf KEIN console.log drin stehen, das 'userState' liest!
  $effect(() => {
      if (data.spots) {
          userState.spots = data.spots;
      }
      if (data.categories) {
          userState.categories = data.categories;
      }
  });

  // UI State
  let imagePreviewUrl = $state<string | null>(null);
  let fileInput = $state<FileList | null>(null); 

  function handleFileChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
          fileInput = target.files;
          const reader = new FileReader();
          reader.onload = (evt) => imagePreviewUrl = evt.target?.result as string || null;
          reader.readAsDataURL(target.files[0]);
      }
  }
</script>

<section class="section">
  <div class="container">
    <h1 class="title mb-6 coffee-text">Dashboard</h1>

    {#if userState.categories.length === 0}
        <div class="notification is-warning">
            Keine Kategorien geladen. Bitte prüfen, ob in der Datenbank Kategorien existieren.
        </div>
    {/if}

    <div class="columns">
      <div class="column is-one-third">
        <div class="box coffee-border">
          <h2 class="subtitle has-text-weight-bold coffee-text">Add New Spot</h2>
          
          <form 
            method="POST" 
            action="?/create" 
            enctype="multipart/form-data" 
            use:enhance={() => {
              return async ({ update, result }) => {
                if (result.type === 'success') {
                   imagePreviewUrl = null; 
                   fileInput = null;
                }
                await update();
              };
            }}
          >
            <div class="field">
              <label class="label" for="title">Spot Name</label>
              <div class="control">
                <input id="title" name="title" class="input" type="text" placeholder="e.g. Hidden Cafe" required />
              </div>
            </div>

            <div class="field">
              <label class="label" for="category">Category</label>
              <div class="control">
                <div class="select is-fullwidth">
                  <select id="category" name="category" required>
                    <option value="" disabled selected>Select Category...</option>
                    {#each userState.categories as cat}
                      <option value={cat._id}>{cat.name}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label" for="description">Description</label>
              <div class="control">
                <textarea id="description" name="description" class="textarea" placeholder="Short description..." rows="2"></textarea>
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control is-expanded">
                <label class="label is-small" for="latitude">Lat</label>
                <input id="latitude" name="latitude" class="input is-small" type="text" value="48.137154">
              </div>
              <div class="control is-expanded">
                <label class="label is-small" for="longitude">Long</label>
                <input id="longitude" name="longitude" class="input is-small" type="text" value="11.576124">
              </div>
            </div>

            <div class="field">
              <label class="label" for="imagefile">Photo</label> 
              {#if imagePreviewUrl}
                <figure class="image is-128x128 mb-2">
                  <img src={imagePreviewUrl} alt="Preview" class="rounded-img">
                </figure>
              {/if}
              <div class="file is-small is-info has-name is-fullwidth">
                <label class="file-label" for="imagefile">
                  <input 
                    class="file-input" 
                    type="file" 
                    id="imagefile" 
                    name="imagefile" 
                    accept="image/*" 
                    onchange={handleFileChange}
                  >
                  <span class="file-cta coffee-btn">
                    <span class="file-icon"><i class="fas fa-camera"></i></span>
                    <span class="file-label">Choose Image</span>
                  </span>
                  <span class="file-name">
                    {fileInput && fileInput.length > 0 ? fileInput[0].name : "No file"}
                  </span>
                </label>
              </div>
            </div>

            <button class="button is-fullwidth mt-4 coffee-btn-main">Create Spot</button>
          </form>
        </div>
      </div>

      <div class="column">
        <h2 class="subtitle has-text-weight-bold coffee-text">My Local Spots ({userState.spots.length})</h2>
        
        {#if userState.spots.length === 0}
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
                          </div>

                          <footer class="card-footer">
                            <form method="POST" action="?/delete" use:enhance class="card-footer-item p-0">
                                <input type="hidden" name="id" value={spot._id}>
                                <button class="button is-white is-fullwidth has-text-danger delete-btn">
                                  <i class="fas fa-trash-alt mr-2"></i> Delete
                                </button>
                            </form>
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
  .spot-img { object-fit: cover; }
  .is-coffee-tag { background-color: #6F4E37; color: white; }
  .delete-btn { border: none; cursor: pointer; height: 100%; width: 100%; }
  .delete-btn:hover { background-color: #fff5f7; color: #cc0f35; }
</style>