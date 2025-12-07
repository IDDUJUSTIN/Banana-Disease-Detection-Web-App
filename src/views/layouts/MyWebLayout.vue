<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h3 class="sidebar-title">🌿 Plant Disease Prediction</h3>
      <nav class="sidebar-nav">
        <router-link to="/main" class="sidebar-link" exact-active-class="active">
          <span class="link-content">
            <i class="fas fa-home"></i>
            <span>Home</span>
          </span>
        </router-link>
        <router-link to="/main/dashboard" class="sidebar-link" active-class="active">
          <span class="link-content">
            <i class="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </span>
        </router-link>
        <router-link to="/main/history" class="sidebar-link" active-class="active">
          <span class="link-content">
            <i class="fas fa-history"></i>
            <span>History</span>
          </span>
        </router-link>
        <router-link to="/main/profile" class="sidebar-link" active-class="active">
          <span class="link-content">
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </span>
        </router-link>
        <button class="sidebar-link logout-btn" @click="logout">
          <span class="link-content">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </span>
        </button>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="content">
      <slot>
        <router-view/>
      </slot>
    </main>
  </div>
</template>


<script>
export default {
  name: "MyWebLayout",
  methods: {
    logout() {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (confirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        this.$router.push("/");
      } else {
        this.$router.push("/main");
      }
    },
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar fixed on the left */
.sidebar {
  width: 220px;
  background: #2e7d32;
  color: #fff;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: bold;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-link {
  display: block;
  width: 100%;
  color: #fff;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: background 0.3s ease;
  font-weight: 500;
  text-align: left;
  box-sizing: border-box;
}
.sidebar-link i {
  margin-right: 8px;
}


.sidebar-link:hover {
  background: #388e3c;
}

.sidebar-link.active {
  background: #66bb6a;
  font-weight: bold;
}

.sidebar-link.active {
  background: #66bb6a;
  font-weight: bold;
}
.sidebar-link {
  display: block;
  width: 100%;
  color: #fff;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: background 0.3s ease;
  font-weight: 500;
  text-align: left;
  box-sizing: border-box;
}

.link-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-link:hover {
  background: #388e3c;
}

.sidebar-link.active {
  background: #66bb6a;
  font-weight: bold;
}

.logout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.75rem 1rem;
  text-align: left;
  color: #fff;
}



.logout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.75rem 1rem;
  text-align: left;
  color: #fff;
}


/* Content area shifted to the right */
.content {
  flex: 1;
  padding: 2rem;
  background: #f1f8e9;
  margin-left: 220px;
  min-height: 100vh;
  overflow-y: auto;
}
</style>
