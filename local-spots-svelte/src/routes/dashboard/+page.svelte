<script lang="ts">
  import { enhance } from '$app/forms';
  import { userState } from "$lib/runes.svelte";
  import type { PageData } from './$types';
  import ImageGallery from '$lib/components/ImageGallery.svelte';

  let { data }: { data: PageData } = $props();

  $effect(() => {
      if (data.spots) userState.spots = data.spots;
      if (data.categories) userState.categories = data.categories;
  });

  // UI State
  let imagePreviewUrls = $state<string[]>([]);
  let fileList = $state<FileList | null>(null);
  let isDragging = $state(false);

  // Sync Input Files Helper
  function updateInputFiles(files: File[]) {
      const dt = new DataTransfer();
      files.forEach(file => dt.items.add(file));
      fileList = dt.files;
      const inputEl = document.getElementById('images') as HTMLInputElement;
      if (inputEl) inputEl.files = fileList;
  }

  function handleFileChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target.files) {
          fileList = target.files;
          imagePreviewUrls = Array.from(target.files).map(file => URL.createObjectURL(file));
      }
  }

  function removeFile(index: number) {
      if (!fileList) return;
      const filesArray = Array.from(fileList);
      filesArray.splice(index, 1);
      updateInputFiles(filesArray);
      imagePreviewUrls = filesArray.map(file => URL.createObjectURL(file));
  }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
</svelte:head>

<section class="section app-background bg-cream">
  <div class="container">
    
    <div class="mb-6 has-text-centered">
        <h1 class="title is-1 font-serif text-espresso">Travel Journal</h1>
        <p class="subtitle is-6 text-latte font-sans tracking-wide">CAPTURE YOUR HIDDEN GEMS</p>
    </div>

    <div class="columns is-variable is-8">
      
      <div class="column is-4">
        <div class="sticky-container">
            <div class="glass-panel p-5">
            <h2 class="title is-4 font-serif text-espresso mb-4">New Entry</h2>
            
            <form 
                method="POST" 
                action="?/create" 
                enctype="multipart/form-data" 
                use:enhance={() => {
                    return async ({ update, result }) => {
                        if (result.type === 'success') {
                            imagePreviewUrls = []; 
                            fileList = null;
                        }
                        await update();
                    };
                }}
            >
                <div class="field mb-4">
                    <label class="label text-muted text-xs uppercase" for="title">Name</label>
                    <div class="control">
                        <input id="title" name="title" class="input modern-input" type="text" placeholder="Spot Name" required />
                    </div>
                </div>

                <div class="field mb-4">
                    <label class="label text-muted text-xs uppercase" for="category">Category</label>
                    <div class="control">
                        <div class="select is-fullwidth">
                            <select id="category" name="category" class="modern-input" required>
                                <option value="" disabled selected>Select...</option>
                                {#each userState.categories as cat}
                                <option value={cat._id}>{cat.name}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="field mb-4">
                    <label class="label text-muted text-xs uppercase" for="description">Description</label>
                    <div class="control">
                        <textarea id="description" name="description" class="textarea modern-input" rows="2"></textarea>
                    </div>
                </div>

                <div class="field is-grouped mb-4">
                    <div class="control is-expanded">
                        <label class="label text-muted text-xs uppercase" for="latitude">Lat</label>
                        <input id="latitude" name="latitude" class="input modern-input text-xs" type="text" value="48.137154">
                    </div>
                    <div class="control is-expanded">
                        <label class="label text-muted text-xs uppercase" for="longitude">Long</label>
                        <input id="longitude" name="longitude" class="input modern-input text-xs" type="text" value="11.576124">
                    </div>
                </div>

                <div class="field mb-6">
                    <label class="label text-muted text-xs uppercase mb-2" for="images">Gallery</label>
                    
                    <div class="upload-zone {isDragging ? 'is-dragging' : ''}">
                        <input 
                            class="file-input-hidden" 
                            type="file" 
                            id="images" 
                            name="images" 
                            multiple
                            accept="image/*" 
                            onchange={handleFileChange}
                            ondragenter={() => isDragging = true}
                            ondragleave={() => isDragging = false}
                            ondrop={() => isDragging = false}
                        >
                        
                        {#if imagePreviewUrls.length > 0}
                            <div class="preview-grid">
                                {#each imagePreviewUrls as url, i}
                                    <div class="preview-item-wrapper">
                                        <div class="preview-item" style="background-image: url({url})"></div>
                                        
                                        <button 
                                            type="button" 
                                            class="preview-delete-btn"
                                            onclick={(e) => {
                                                e.preventDefault(); 
                                                removeFile(i);
                                            }}
                                            aria-label="Remove image"
                                        >
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                {/each}
                            </div>
                            <p class="text-xs text-center mt-2 text-success">
                                {imagePreviewUrls.length} images selected
                            </p>
                        {:else}
                            <div class="upload-placeholder">
                                <span class="icon is-large text-latte mb-2"><i class="fas fa-cloud-upload-alt fa-2x"></i></span>
                                <p class="is-size-7 has-text-grey">Click to upload</p>
                            </div>
                        {/if}
                    </div>
                </div>

                <button class="button is-fullwidth btn-espresso shadow-hover">Create Entry</button>
            </form>
            </div>
        </div>
      </div>

      <div class="column is-8">
        <div class="spot-grid">
            {#each userState.spots as spot (spot._id)}
                <div class="spot-card">
                    <div class="spot-gallery">
                        <ImageGallery 
                            images={(spot.images && spot.images.length > 0) ? spot.images : (spot.img ? [spot.img] : [])} 
                            spotId={spot._id}
                        />
                        <span class="category-badge">
                            {typeof spot.category === 'object' ? spot.category?.name : 'Spot'}
                        </span>
                    </div>
                    
                    <div class="spot-content p-4">
                        <h3 class="title is-5 font-serif text-espresso mb-2">{spot.title}</h3>
                        <div class="level is-mobile mt-auto">
                            <div class="level-left"></div>
                            <div class="level-right">
                                <form method="POST" action="?/delete" use:enhance>
                                    <input type="hidden" name="id" value={spot._id}>
                                    <button class="delete-icon-btn" title="Delete Spot">
                                        <i class="far fa-trash-alt"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
    /* VARIABLES & UTILS */
    :global(:root) {
        --color-espresso: #2C241B;
        --color-latte: #C5A085;
        --color-cream: #F9F7F2;
        --color-white: #FFFFFF;
        --color-muted: #8A817C;
        --font-serif: 'Playfair Display', serif;
        --font-sans: 'Inter', sans-serif;
    }
    .app-background { background-color: var(--color-cream); min-height: 100vh; }
    .font-serif { font-family: var(--font-serif); }
    .font-sans { font-family: var(--font-sans); }
    .text-espresso { color: var(--color-espresso) !important; }
    .text-latte { color: var(--color-latte) !important; }
    .text-muted { color: var(--color-muted) !important; }
    .text-xs { font-size: 0.75rem; }
    .uppercase { text-transform: uppercase; letter-spacing: 0.05em; }
    .bg-cream { background-color: #EDE8E0; }

    /* COMPONENTS */
    .sticky-container { position: sticky; top: 2rem; }
    .glass-panel {
        background: var(--color-white);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(44, 36, 27, 0.08);
        border: 1px solid rgba(197, 160, 133, 0.2);
    }
    .modern-input {
        background-color: #F7F5F3; border: 1px solid transparent; border-radius: 8px; box-shadow: none; font-family: var(--font-sans);
    }
    .modern-input:focus {
        background-color: var(--color-white); border-color: var(--color-latte); box-shadow: 0 0 0 3px rgba(197, 160, 133, 0.1);
    }

    /* UPLOAD ZONE */
    .upload-zone {
        position: relative; border: 2px dashed #E0D6CE; border-radius: 12px; padding: 1.5rem;
        background-color: #FAFAFA; transition: all 0.2s; cursor: pointer; min-height: 120px;
        display: flex; align-items: center; justify-content: center;
    }
    .upload-zone:hover, .upload-zone.is-dragging { border-color: var(--color-latte); background-color: #FAF5F0; }
    .file-input-hidden { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10; }
    .upload-placeholder { text-align: center; }

    /* PREVIEW GRID - HIER WAREN DIE FEHLER */
    .preview-grid { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 20; }
    .preview-item-wrapper { position: relative; width: 60px; height: 60px; }
    .preview-item { width: 100%; height: 100%; border-radius: 8px; background-size: cover; background-position: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .preview-delete-btn {
        position: absolute; top: -5px; right: -5px; background: #ff3860; color: white; border: 2px solid white;
        border-radius: 50%; width: 20px; height: 20px; font-size: 10px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; z-index: 30; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .preview-delete-btn:hover { transform: scale(1.1); }

    /* BUTTONS & CARDS */
    .btn-espresso { background-color: var(--color-espresso); color: var(--color-white); border: none; border-radius: 8px; height: 3rem; font-weight: 600; }
    .shadow-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(44, 36, 27, 0.3); color: white; }
    
    .spot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .spot-card { background: var(--color-white); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.02); }
    .spot-gallery { position: relative; background-color: #f0f0f0; }
    .category-badge { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.95); color: var(--color-espresso); font-size: 0.7rem; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; z-index: 5; }
    .delete-icon-btn { background: none; border: none; color: #e0e0e0; cursor: pointer; }
    .delete-icon-btn:hover { color: #D32F2F; }
</style>