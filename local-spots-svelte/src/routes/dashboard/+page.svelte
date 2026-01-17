<script lang="ts">
  import { enhance } from '$app/forms';
  import { userState } from "$lib/runes.svelte";
  import type { PageData, ActionData } from './$types';
  import ImageGallery from '$lib/components/ImageGallery.svelte';

  let { data, form }: { data: PageData, form: ActionData } = $props();

  // Fehlermeldung State
  let errorMessage = $state<string | null>(null);

  $effect(() => {
      if (data.spots) userState.spots = data.spots;
      if (data.categories) userState.categories = data.categories;
      if (form?.error) errorMessage = form.error;
      else if (form?.success) errorMessage = null;
  });

  // UI State
  let imagePreviewUrls = $state<string[]>([]);
  let fileList = $state<FileList | null>(null);
  let isDragging = $state(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; 

  function handleFileChange(e: Event) {
      const target = e.target as HTMLInputElement;
      errorMessage = null; 

      if (target.files) {
          for (const file of target.files) {
              if (file.size > MAX_FILE_SIZE) {
                  errorMessage = `File "${file.name}" is too large (max 10MB).`;
                  target.value = ''; 
                  imagePreviewUrls = [];
                  fileList = null;
                  return;
              }
          }

          fileList = target.files;
          imagePreviewUrls = Array.from(target.files).map(file => URL.createObjectURL(file));
      }
  }

  function removeFile(index: number) {
      if (!fileList) return;
      const dt = new DataTransfer();
      const filesArray = Array.from(fileList);
      filesArray.splice(index, 1);
      filesArray.forEach(file => dt.items.add(file));
      
      fileList = dt.files;
      const inputEl = document.getElementById('images') as HTMLInputElement;
      if (inputEl) inputEl.files = fileList;
      
      imagePreviewUrls = filesArray.map(file => URL.createObjectURL(file));
  }
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,600;1,600&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</svelte:head>

{#if errorMessage}
    <div class="container mt-4 sticky-error">
        <div class="notification is-danger is-light shadow-soft">
            <button class="delete" onclick={() => errorMessage = null} aria-label="Close notification"></button>
            <span class="icon mr-2"><i class="fas fa-exclamation-circle"></i></span>
            {errorMessage}
        </div>
    </div>
{/if}

<section class="section app-background">
  <div class="bg-pattern"></div>
  
  <div class="container position-relative">
    
    <div class="mb-6 has-text-centered header-section">
        <h1 class="title is-1 font-serif text-espresso mb-2">Travel Journal</h1>
        <div class="subtitle-wrapper">
             <p class="subtitle is-6 text-latte font-sans tracking-wide uppercase">Capture Your Hidden Gems</p>
             <div class="separator-line"></div>
        </div>
    </div>

    <div class="columns is-variable is-8">
      
      <div class="column is-4">
        <div class="sticky-container">
            <div class="glass-panel p-5 p-md-6">
            <h2 class="title is-4 font-serif text-espresso mb-5 display-flex align-items-center">
                <span class="icon-box mr-3"><i class="fas fa-feather-alt"></i></span>
                New Entry
            </h2>
            
            <form 
                method="POST" 
                action="?/create" 
                enctype="multipart/form-data" 
                use:enhance={() => {
                    return async ({ update, result }) => {
                        if (result.type === 'success') {
                            imagePreviewUrls = []; 
                            fileList = null;
                            errorMessage = null;
                        }
                        await update();
                    };
                }}
            >
                <div class="field mb-4">
                    <label class="label text-muted text-xs uppercase font-poppins" for="title">Location Name</label>
                    <div class="control has-icons-left">
                        <input id="title" name="title" class="input modern-input" type="text" placeholder="e.g. The Cozy Corner Cafe" required />
                        <span class="icon is-small is-left text-latte">
                            <i class="fas fa-map-marker-alt"></i>
                        </span>
                    </div>
                </div>

                <div class="field mb-4">
                    <label class="label text-muted text-xs uppercase font-poppins" for="category">Category</label>
                    <div class="control has-icons-left">
                        <div class="select is-fullwidth">
                            <select id="category" name="category" class="modern-input has-icon-padding" required>
                                <option value="" disabled selected>Select a category...</option>
                                {#each userState.categories as cat}
                                <option value={cat._id}>{cat.name}</option>
                                {/each}
                            </select>
                        </div>
                        <span class="icon is-small is-left text-latte">
                            <i class="fas fa-tag"></i>
                        </span>
                    </div>
                </div>

                <div class="field mb-4">
                    <label class="label text-muted text-xs uppercase font-poppins" for="description">My Experience</label>
                    <div class="control">
                        <textarea id="description" name="description" class="textarea modern-input" rows="3" placeholder="What made this place special?"></textarea>
                    </div>
                </div>

                <div class="field is-grouped mb-5">
                    <div class="control is-expanded mr-2">
                        <label class="label text-muted text-xs uppercase font-poppins" for="latitude">Latitude</label>
                        <div class="control has-icons-left">
                            <input id="latitude" name="latitude" class="input modern-input text-xs" type="text" value="48.137154">
                            <span class="icon is-small is-left text-latte is-size-7">
                                <i class="fas fa-globe-europe"></i>
                            </span>
                        </div>
                    </div>
                    <div class="control is-expanded ml-2">
                         <label class="label text-muted text-xs uppercase font-poppins" for="longitude">Longitude</label>
                         <div class="control has-icons-left">
                            <input id="longitude" name="longitude" class="input modern-input text-xs" type="text" value="11.576124">
                            <span class="icon is-small is-left text-latte is-size-7">
                                <i class="fas fa-globe-europe"></i>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="field mb-6">
                    <label class="label text-muted text-xs uppercase mb-3 font-poppins" for="images">Photo Gallery</label>
                    
                    <div class="upload-zone {isDragging ? 'is-dragging' : ''} {imagePreviewUrls.length > 0 ? 'has-files' : ''}">
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
                            <div class="preview-grid custom-scrollbar">
                                {#each imagePreviewUrls as url, i}
                                    <div class="preview-item-wrapper swing-in-top-fwd" style="animation-delay: {i * 0.1}s">
                                        <div class="preview-item shadow-sm" style="background-image: url({url})"></div>
                                        <button 
                                            type="button" 
                                            class="preview-delete-btn" 
                                            onclick={(e) => { e.preventDefault(); removeFile(i); }} 
                                            aria-label="Remove image preview"
                                        >
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                {/each}
                            </div>
                            <p class="text-xs text-center mt-3 text-accent font-poppins font-medium">
                                <i class="fas fa-check-circle mr-1"></i> {imagePreviewUrls.length} photos ready
                            </p>
                        {:else}
                            <div class="upload-placeholder p-4">
                                <div class="icon-wrapper-circle mb-3 scale-up-center">
                                     <span class="icon is-medium text-accent"><i class="fas fa-cloud-upload-alt fa-2x"></i></span>
                                </div>
                                <p class="is-size-6 font-medium text-espresso mb-1">Drag & Drop files here</p>
                                <p class="is-size-7 text-muted">or click to browse</p>
                            </div>
                        {/if}
                    </div>
                </div>

                <button class="button is-fullwidth btn-premium shadow-hover">
                    <span class="icon mr-2"><i class="fas fa-paper-plane"></i></span>
                    <span>Create Entry</span>
                </button>
            </form>
            </div>
        </div>
      </div>

      <div class="column is-8">
        {#if userState.spots.length === 0}
            <div class="empty-state has-text-centered p-6 glass-panel slide-in-bottom">
                <span class="icon is-large text-latte mb-4"><i class="far fa-map fa-4x"></i></span>
                <h3 class="title is-4 text-espresso font-serif">Your journal is empty</h3>
                <p class="subtitle is-6 text-muted">Start by adding your first favorite spot on the left.</p>
            </div>
        {:else}
        <div class="spot-grid">
            {#each userState.spots as spot (spot._id)}
                <div class="spot-card slide-in-bottom">
                    <div class="spot-gallery-wrapper">
                        <ImageGallery 
                            images={(spot.images && spot.images.length > 0) ? spot.images : (spot.img ? [spot.img] : [])} 
                            spotId={spot._id}
                        />
                        <span class="category-pill glass-badge">
                             <i class="fas fa-tag mr-1 is-size-7"></i>
                            {typeof spot.category === 'object' ? spot.category?.name : 'Spot'}
                        </span>
                    </div>
                    
                    <div class="spot-content p-5">
                        <div class="content-header mb-3">
                             <h3 class="title is-5 font-serif text-espresso mb-0 text-truncate">{spot.title}</h3>
                        </div>
                        
                        <p class="is-size-6 text-muted mb-4 description-clamp">{spot.description || "No description provided."}</p>
                        
                        <div class="level is-mobile mt-auto pt-3 border-top-soft">
                            <div class="level-left">
                                <div class="location-tag display-flex align-items-center text-muted is-size-7 font-poppins">
                                     <i class="fas fa-map-pin mr-2 text-accent"></i>
                                     <span>{spot.latitude.toFixed(3)}, {spot.longitude.toFixed(3)}</span>
                                </div>
                            </div>
                            <div class="level-right">
                                <form method="POST" action="?/delete" use:enhance>
                                    <input type="hidden" name="id" value={spot._id}>
                                    <button class="delete-icon-btn" aria-label="Delete Spot" title="Delete Spot">
                                        <i class="far fa-trash-alt"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
    /* --- VARIABLES & UTILS --- */
    :global(:root) {
        --color-espresso: #3C2F2F;
        --color-latte: #B08D74;
        --color-accent: #C57B57;
        --color-cream: #F8F4F0;
        --color-white: #FFFFFF;
        --color-muted: #948B8B;
        
        --font-serif: 'Playfair Display', serif;
        --font-sans: 'Inter', sans-serif;
        --font-poppins: 'Poppins', sans-serif;

        --shadow-soft: 0 12px 24px -10px rgba(60, 47, 47, 0.15);
        --shadow-card: 0 15px 35px -10px rgba(60, 47, 47, 0.1), 0 5px 15px -5px rgba(0,0,0,0.05);
        --shadow-hover: 0 25px 50px -12px rgba(60, 47, 47, 0.25);
        
        --glass-bg: rgba(255, 255, 255, 0.75);
        --glass-border: 1px solid rgba(255, 255, 255, 0.5);
        --blur-strength: blur(16px);

        --radius-lg: 20px;
        --radius-md: 12px;
    }

    /* Base & Background */
    .app-background { 
        background-color: var(--color-cream); 
        min-height: 100vh; 
        position: relative;
        overflow-x: hidden;
    }
    .bg-pattern {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background-image: radial-gradient(var(--color-latte) 0.5px, transparent 0.5px), radial-gradient(var(--color-latte) 0.5px, var(--color-cream) 0.5px);
        background-size: 40px 40px;
        background-position: 0 0, 20px 20px;
        opacity: 0.07;
        z-index: 0;
    }
    .container.position-relative { z-index: 1; }

    /* Typography */
    .font-serif { font-family: var(--font-serif); }
    .font-sans { font-family: var(--font-sans); }
    .font-poppins { font-family: var(--font-poppins); }
    .font-medium { font-weight: 500; }
    .text-espresso { color: var(--color-espresso) !important; }
    .text-latte { color: var(--color-latte) !important; }
    .text-accent { color: var(--color-accent) !important; }
    .text-muted { color: var(--color-muted) !important; }
    .text-xs { font-size: 0.7rem; }
    .uppercase { text-transform: uppercase; letter-spacing: 0.08em; }
    .tracking-wide { letter-spacing: 0.1em; }

    /* Header Section */
    .header-section h1 { letter-spacing: -0.02em; text-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .subtitle-wrapper { display: inline-flex; flex-direction: column; align-items: center; }
    .separator-line { width: 40px; height: 3px; background: var(--color-accent); margin-top: 12px; border-radius: 2px; opacity: 0.7; }

    /* --- GLASS PANEL --- */
    .sticky-container { position: sticky; top: 2rem; z-index: 20; }
    .sticky-error { position: sticky; top: 1rem; z-index: 100; }

    .glass-panel {
        background: var(--glass-bg);
        backdrop-filter: var(--blur-strength);
        -webkit-backdrop-filter: var(--blur-strength);
        border-radius: var(--radius-lg);
        border: var(--glass-border);
        box-shadow: var(--shadow-soft);
        background-image: linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(255,255,255,0.1));
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .glass-panel:hover { box-shadow: var(--shadow-card); }

    .icon-box {
        display: inline-flex; align-items: center; justify-content: center;
        width: 36px; height: 36px; background: var(--color-cream); color: var(--color-accent);
        border-radius: 10px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    }

    /* --- MODERN INPUTS --- */
    .modern-input, .textarea.modern-input, .select select.modern-input {
        background-color: rgba(247, 245, 243, 0.8);
        border: 1px solid transparent; 
        border-radius: var(--radius-md); 
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
        font-family: var(--font-poppins);
        font-size: 0.9rem;
        color: var(--color-espresso);
        transition: all 0.3s ease;
        width: 100%;
    }
    
    .select select.modern-input.has-icon-padding { padding-left: 2.8em !important; }
    .input.modern-input { height: 3em; padding-left: 2.8em; }
    .control.has-icons-left .icon { height: 3em; z-index: 5; width: 3em; pointer-events: none; }
    
    .modern-input:focus, .textarea.modern-input:focus, .select select.modern-input:focus {
        background-color: var(--color-white);
        border-color: var(--color-latte);
        box-shadow: 0 0 0 3px rgba(197, 123, 87, 0.15), 0 4px 10px rgba(0,0,0,0.05);
    }
    .modern-input::placeholder { color: #afa7a7; }

    /* --- UPLOAD ZONE --- */
    .upload-zone {
        position: relative; 
        border: 2px dashed var(--color-latte); 
        border-radius: var(--radius-md); 
        padding: 1.5rem;
        background: rgba(250, 248, 246, 0.6);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer; 
        min-height: 140px;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        overflow: hidden;
    }
    .upload-zone:hover { border-color: var(--color-accent); background: rgba(255, 255, 255, 0.8); box-shadow: var(--shadow-soft); }
    .upload-zone.is-dragging { 
        border-color: var(--color-accent); 
        background: rgba(197, 123, 87, 0.05); 
        transform: scale(1.02);
    }
    .upload-zone.has-files {
        justify-content: flex-start;
        padding: 1rem;
        background: var(--color-white);
        border-style: solid;
        border-color: rgba(197, 123, 87, 0.2);
    }

    .file-input-hidden { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 10; }
    
    .icon-wrapper-circle {
        width: 64px; height: 64px; background: var(--color-cream); border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        box-shadow: var(--shadow-soft); margin-bottom: 1rem;
    }

    .preview-grid { 
        display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 20; width: 100%; 
        max-height: 160px; overflow-y: auto; padding: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-latte); border-radius: 3px; }

    .preview-item-wrapper { position: relative; width: 70px; height: 70px; }
    .preview-item { 
        width: 100%; height: 100%; border-radius: 12px; background-size: cover; background-position: center; 
        box-shadow: 0 4px 8px rgba(0,0,0,0.1); border: 2px solid var(--color-white);
        transition: transform 0.2s;
    }
    .preview-item-wrapper:hover .preview-item { transform: scale(1.05); }
    .preview-delete-btn {
        position: absolute; top: -6px; right: -6px; 
        background: var(--color-accent); color: white; border: 2px solid white;
        border-radius: 50%; width: 22px; height: 22px; font-size: 10px; 
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; z-index: 30; box-shadow: 0 3px 6px rgba(0,0,0,0.2);
        transition: all 0.2s;
    }
    .preview-delete-btn:hover { background-color: #D32F2F; transform: scale(1.1) rotate(90deg); }

    .btn-premium { 
        background: linear-gradient(135deg, var(--color-espresso), #4a3a3a);
        color: var(--color-white); border: none; border-radius: var(--radius-md); 
        height: 3.2rem; font-weight: 600; letter-spacing: 0.05em;
        box-shadow: 0 4px 10px rgba(44, 36, 27, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-premium:hover { 
        transform: translateY(-3px); 
        box-shadow: 0 8px 20px rgba(44, 36, 27, 0.3); 
        background: linear-gradient(135deg, #4a3a3a, var(--color-espresso));
        color: white;
    }
    .shadow-hover:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(44, 36, 27, 0.3); }
    
    /* --- SPOT CARDS --- */
    .spot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
    
    .spot-card { 
        background: var(--color-white); border-radius: var(--radius-lg); overflow: hidden; 
        box-shadow: var(--shadow-card); border: none;
        display: flex; flex-direction: column;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        height: 100%;
    }
    .spot-card:hover { transform: translateY(-8px) scale(1.01); box-shadow: var(--shadow-hover); }

    .spot-gallery-wrapper { position: relative; background-color: var(--color-cream); overflow: hidden; border-bottom: 1px solid rgba(0,0,0,0.03); }
    
    .glass-badge { 
        position: absolute; top: 12px; right: 12px; 
        background: rgba(255, 255, 255, 0.85); 
        backdrop-filter: blur(8px);
        color: var(--color-espresso); 
        font-size: 0.7rem; font-weight: 700; padding: 6px 12px; 
        border-radius: 30px; text-transform: uppercase; letter-spacing: 0.05em;
        z-index: 5; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        display: flex; align-items: center;
    }

    .spot-content { display: flex; flex-direction: column; flex-grow: 1; }
    .text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    
    /* FIX: Standard Line Clamp für Kompatibilität */
    .description-clamp { 
        display: -webkit-box; 
        -webkit-line-clamp: 3; 
        line-clamp: 3; 
        -webkit-box-orient: vertical; 
        overflow: hidden;
        line-height: 1.5;
    }
    .border-top-soft { border-top: 1px solid rgba(0,0,0,0.04); }

    .delete-icon-btn { 
        background: var(--color-cream); border: none; color: var(--color-latte); cursor: pointer;
        width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        transition: all 0.2s; opacity: 0.7;
    }
    .delete-icon-btn:hover { color: #D32F2F; background: #ffeaea; opacity: 1; transform: scale(1.1); }

    /* --- ANIMATIONS --- */
    @keyframes slide-in-bottom { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
    .slide-in-bottom { animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }

    @keyframes swing-in-top-fwd { 0% { transform: rotateX(-100deg); transform-origin: top; opacity: 0; } 100% { transform: rotateX(0deg); transform-origin: top; opacity: 1; } }
    .swing-in-top-fwd { animation: swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }

    @keyframes scale-up-center { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
    .scale-up-center { animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both; }

    .display-flex { display: flex; }
    .align-items-center { align-items: center; }
</style>