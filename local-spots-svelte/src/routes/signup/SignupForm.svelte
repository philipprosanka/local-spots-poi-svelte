<script lang="ts">
  import { goto } from "$app/navigation";
  import Message from "$lib/components/Message.svelte";
  import UserCredentials from "$lib/components/UserCredentials.svelte";
  import UserDetails from "$lib/components/UserDetails.svelte";

  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let password = $state("");
  let message = $state("");

  async function signup() {
    message = "";
    try {
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      if (res.ok) {
        goto("/login");
      } else {
        const data = await res.json();
        message = data.message || "Signup failed";
      }
    } catch (err) {
      message = "Network error";
    }
  }
</script>

<div class="box">
  {#if message}
    <Message {message} />
  {/if}
  <UserDetails bind:firstName bind:lastName />
  <UserCredentials bind:email bind:password />
  <button onclick={signup} class="button">Sign Up</button>
  <p class="has-text-centered">
    Already have an account? <a href="/login" data-cy="login-redirect">Login Here</a>
  </p>
</div>