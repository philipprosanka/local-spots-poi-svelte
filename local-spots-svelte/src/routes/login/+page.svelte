<script lang="ts">
    import { api } from "$lib/api";
    import { auth } from "$lib/runes.svelte";
    import { goto } from "$app/navigation";
    import Navbar from "$lib/components/Navbar.svelte";
  

    let email = $state("");
    let password = $state("");
    let error = $state("");

    async function handleLogin(e: Event) {
        e.preventDefault();
        try {
            const res = await api.post("users/authenticate", { email, password });
            if (res.success && res.token) {
                auth.login(res.token);
        
                goto("/dashboard");
                
            }
        } catch (err) {
            error = "Invalid credentials";
        }
    }
</script>


<section class="section">
    <div class="container column is-4 is-offset-4">
        <h1 class="title">Log in</h1>
        <form onsubmit={handleLogin} class="box">
            <div class="field">
                <label class="label">Email</label>
                <div class="control">
                    <input class="input" type="email" bind:value={email} required placeholder="homer@simpson.com">
                </div>
            </div>
            <div class="field">
                <label class="label">Password</label>
                <div class="control">
                    <input class="input" type="password" bind:value={password} required>
                </div>
            </div>
            {#if error}
                <div class="notification is-danger">{error}</div>
            {/if}
            <div class="box has-text-centered">
  <h3 class="title is-4">Social Login</h3>
  
  <div class="field">
    <a class="button is-fullwidth is-medium" 
       style="background-color: #24292e; color: white; border: none;" 
       href="https://local-spots-poi.onrender.com/auth/github">
      <span class="icon">
        <i class="fab fa-github"></i>
      </span>
      <span>Mit GitHub anmelden</span>
    </a>
  </div>

  <div class="field">
    <a class="button is-fullwidth is-medium is-outlined" 
       style="border-color: #4285F4; color: #4285F4;"
       href="https://local-spots-poi.onrender.com/auth/google">
      <span class="icon">
        <i class="fab fa-google"></i>
      </span>
      <span>Mit Google anmelden</span>
    </a>
  </div>

  <p class="is-size-7 has-text-grey mt-3">
    Ein Klick genügt – wir erstellen automatisch ein Konto für dich.
  </p>
</div>
        </form>
    </div>
</section>





