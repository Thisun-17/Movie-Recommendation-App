<template>
  <div id="app">
    <nav class="navbar">
      <div class="container">
        <h1 class="navbar-brand">Movie Recommendation App</h1>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/watchlist">My Watchlist</router-link>
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
        </div>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar {
  background-color: #2c3e50;
  padding: 15px 0;
  margin-bottom: 30px;
}

.navbar-brand {
  color: white;
  font-size: 1.5rem;
  margin: 0;
}

.nav-links {
  margin-top: 10px;
}

.nav-links a {
  color: white;
  margin-right: 15px;
  text-decoration: none;
  font-weight: 600;
}

.nav-links a.router-link-active {
  color: #42b983;
}
</style>
