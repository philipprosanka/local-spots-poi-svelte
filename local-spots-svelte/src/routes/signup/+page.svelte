<script lang="ts">
  import { authService } from "$lib/services/auth-service";
  import { goto } from "$app/navigation";

  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let password = $state("");
  let error = $state("");

  async function handleSignup(e: Event) {
    e.preventDefault();
    const success = await authService.register(firstName, lastName, email, password);
    if (success) {
      goto("/login");
    } else {
      error = "Registration failed. Email might be taken.";
    }
  }
</script>

<section class="section">
  <div class="container column is-6 is-offset-3">
    <h1 class="title has-text-centered">Sign Up</h1>
    
    <form onsubmit={handleSignup} class="box">
      <div class="field is-horizontal">
        <div class="field-body">
          <div class="field">
            <label class="label">First Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="Homer" bind:value={firstName} required>
            </div>
          </div>
          <div class="field">
            <label class="label">Last Name</label>
            <div class="control">
              <input class="input" type="text" placeholder="Simpson" bind:value={lastName} required>
            </div>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input class="input" type="email" placeholder="homer@simpson.com" bind:value={email} required>
        </div>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input class="input" type="password" placeholder="******" bind:value={password} required>
        </div>
      </div>

      {#if error}
        <div class="notification is-danger">{error}</div>
      {/if}

      <div class="field mt-5">
        <button class="button is-link is-fullwidth">Register</button>
      </div>
    </form>
  </div>
</section>