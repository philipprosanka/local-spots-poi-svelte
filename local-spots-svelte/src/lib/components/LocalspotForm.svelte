<script lang="ts">
  import type { Category, LocalSpot } from "$lib/types/localspot-types";
  export let categories: Category[] = [];
  export let onAdd: (data: any) => void;

  let title = "";
  let description = "";
  let category = "";
  let latitude = "";
  let longitude = "";

  function submit() {
    onAdd({
      title,
      description,
      category,
      latitude,
      longitude,
    });
    title = description = category = latitude = longitude = "";
  }
</script>

<form on:submit|preventDefault={submit}>
  <div class="field">
    <label class="label">Name</label>
    <input class="input" type="text" placeholder="Enter localspot name" bind:value={title} required>
  </div>
  <div class="field">
    <label class="label">Description</label>
    <input class="input" type="text" placeholder="Enter localspot description" bind:value={description}>
  </div>
  <div class="field">
    <label class="label">Category</label>
    <div class="control">
      <div class="select is-fullwidth">
        <select bind:value={category}>
          <option value="">Select a category</option>
          {#each categories as cat}
            <option value={cat._id}>{cat.icon} {cat.name}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <label class="label">Latitude</label>
        <input class="input" type="text" placeholder="e.g. 52.5200" bind:value={latitude} required>
      </div>
      <div class="field">
        <label class="label">Longitude</label>
        <input class="input" type="text" placeholder="e.g. 13.4050" bind:value={longitude} required>
      </div>
    </div>
  </div>
  <button class="button is-link">Add LocalSpot</button>
</form>