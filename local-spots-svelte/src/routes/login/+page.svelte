<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import Navbar from "$lib/components/Navbar.svelte";

    
    let { form }: { form: ActionData } = $props();
</script>


<section class="section">
    <div class="container column is-4 is-offset-4">
        <div class="box">
            <h1 class="title has-text-centered">Log in</h1>
            
            <form method="POST" use:enhance>
                <div class="field">
                    <label class="label" for="email">Email</label>
                    <div class="control">
                        <input 
                            id="email" 
                            name="email" 
                            class="input" 
                            type="email" 
                            value={form?.email ?? ''} 
                            required 
                            placeholder="homer@simpson.com"
                        >
                    </div>
                </div>
                
                <div class="field">
                    <label class="label" for="password">Password</label>
                    <div class="control">
                        <input id="password" name="password" class="input" type="password" required>
                    </div>
                </div>

                {#if form?.error}
                    <div class="notification is-danger is-light">{form.error}</div>
                {/if}

                <div class="field mt-5">
                    <button class="button is-primary is-fullwidth">Log in</button>
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
                    One click is enough – we automatically create an account for you.
                </p>
                <p class="is-size-7 mt-2">
                    No account yet? <a href="/signup">Register here</a>
                </p>
            </div>
        </div>
    </div>
</section>