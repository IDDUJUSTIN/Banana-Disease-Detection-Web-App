<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h3 class="sidebar-title">🌿 Admin Panel</h3>
      <nav class="sidebar-nav">
        <router-link to="/admin" class="sidebar-link" exact-active-class="active">
          <span class="link-content">
            <i class="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </span>
        </router-link>
        <router-link to="/admin/users" class="sidebar-link" active-class="active">
          <span class="link-content">
            <i class="fas fa-users"></i>
            <span>Users</span>
          </span>
        </router-link>
        <router-link to="/admin/activity-logs" class="sidebar-link" active-class="active">
          <span class="link-content">
            <i class="fas fa-clipboard-list"></i>
            <span>Activity Logs</span>
          </span>
        </router-link>
        <router-link to="/admin/user-actions" class="sidebar-link" active-class="active">
          <span class="link-content">
            <i class="fas fa-tasks"></i>
            <span>User Activity</span>
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
  name: "AdminLayout",
  methods: {
    logout() {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (confirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");
        this.$router.push("/"); // back to login
      } else {
        this.$router.push("/admin"); // stay in admin dashboard
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

/* Sidebar */
.sidebar {
  width: 220px;
  background: #1b5e20;
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

/* Sidebar link wrapper */
.sidebar-link {
  display: block;
  width: 100%;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.3s ease;
  font-weight: 500;
  box-sizing: border-box;
  cursor: pointer;
}

/* Inner content for icon + label */
.link-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.75rem 1rem;
  width: 100%;
  height: 100%;
}

/* Icon spacing */
.sidebar-link i {
  min-width: 20px;
  text-align: center;
}

/* Hover and active states */
.sidebar-link:hover .link-content {
  background: #388e3c;
  border-radius: 6px;
}

.sidebar-link.active .link-content {
  background: #66bb6a;
  font-weight: bold;
  border-radius: 6px;
}

/* Logout button styling */
.logout-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
  width: 100%;
  text-align: left;
  font-weight: 500;
  border-radius: 6px;
}

.logout-btn .link-content {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

/* Main content area */
.content {
  flex: 1;
  padding: 2rem;
  background: #f1f8e9;
  margin-left: 220px;
  min-height: 100vh;
  overflow-y: auto;
}

</style>
