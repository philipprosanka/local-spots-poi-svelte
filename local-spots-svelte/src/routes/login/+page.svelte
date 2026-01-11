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
            <button class="button is-link is-fullwidth">Log in</button>
        </form>
    </div>
</section>





