<script lang="ts">
    import { api } from "$lib/api";
    import { auth } from "$lib/runes.svelte";
    import { goto } from "$app/navigation";
    // Navbar import removed
  
    let email = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false); // Loading state for better UX

    async function handleLogin(e: Event) {
        e.preventDefault();
        loading = true;
        error = "";
        try {
            const res = await api.post("users/authenticate", { email, password });
            if (res.success && res.token) {
                auth.login(res.token);
                goto("/dashboard");
            } else {
                error = "Login failed.";
            }
        } catch (err) {
            error = "Invalid credentials";
        } finally {
            loading = false;
        }
    }
</script>

<section class="section">
    <div class="container column is-4 is-offset-4">
        <div class="box">
            <h1 class="title has-text-centered">Log in</h1>
            
            <form onsubmit={handleLogin}>
                <div class="field">
                    <label class="label" for="email">Email</label>
                    <div class="control">
                        <input id="email" class="input" type="email" bind:value={email} required placeholder="homer@simpson.com">
                    </div>
                </div>
                <div class="field">
                    <label class="label" for="password">Password</label>
                    <div class="control">
                        <input id="password" class="input" type="password" bind:value={password} required>
                    </div>
                </div>

                {#if error}
                    <div class="notification is-danger is-light">{error}</div>
                {/if}

                <div class="field mt-5">
                    <button class="button is-primary is-fullwidth {loading ? 'is-loading' : ''}" type="submit">
                        Log in
                    </button>
                </div>
            </form>
            
            <div class="is-divider" style="margin: 2rem 0; text-align: center; border-bottom: 1px solid #ddd; line-height: 0.1em;">
                <span style="background:#fff; padding:0 10px; color:#999;">OR</span>
            </div>

            <div class="has-text-centered">
                <h3 class="title is-6 mb-3">Social Login</h3>
                
                <div class="field">
                    <a class="button is-fullwidth" 
                       style="background-color: #24292e; color: white; border: none;" 
                       href="https://local-spots-poi.onrender.com/auth/github">
                        <span class="icon"><i class="fab fa-github"></i></span>
                        <span>Log in with GitHub</span>
                    </a>
                </div>

                <div class="field">
                    <a class="button is-fullwidth is-outlined" 
                       style="border-color: #4285F4; color: #4285F4;"
                       href="https://local-spots-poi.onrender.com/auth/google">
                        <span class="icon"><i class="fab fa-google"></i></span>
                        <span>Log in with Google</span>
                    </a>
                </div>

                <p class="is-size-7 has-text-grey mt-4">
                    One click is enough – we'll automatically create an account for you.
                </p>
            </div>
        </div>
    </div>
</section>