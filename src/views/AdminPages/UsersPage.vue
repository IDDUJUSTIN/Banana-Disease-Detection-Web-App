<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">
      <i class="fas fa-users"></i> User Management
    </h2>

    <div class="mb-4">
      <label for="searchEmail" class="form-label fw-bold"> Search User by Email</label>
      <div class="input-group">
        <input type="text" id="searchEmail" v-model="searchEmail" class="form-control" placeholder="Enter email address"
          @input="onSearchInput" @keyup.enter="searchUserByEmail" />
        <button class="btn btn-success" @click="searchUserByEmail">
          Search
        </button>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-striped table-hover">
          <thead class="table-success">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id">
              <td>{{ index + 1 + (currentPage - 1) * 10 }}</td>
              <td>{{ user.fullname }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.contact_number }}</td>
              <td>{{ new Date(user.created_at).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-content-between align-items-center mt-4">
          <button class="btn btn-outline-success" :disabled="currentPage === 1" @click="fetchUsers(currentPage - 1)">
            ← Previous
          </button>

          <div>
            <button v-for="page in visiblePages" :key="page" class="btn btn-sm"
              :class="page === currentPage ? 'btn-success' : 'btn-outline-success'" @click="fetchUsers(page)">
              {{ page }}
            </button>
          </div>

          <button class="btn btn-outline-success" :disabled="currentPage === totalPages"
            @click="fetchUsers(currentPage + 1)">
            Next →
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";

export default {
  name: "UsersPage",
  data() {
    return {
      baseUrl: inject("baseUrl"),
      users: [],
      error: null,
      currentPage: 1,
      totalPages: 1,
      searchEmail: "", 
    };
  },
  methods: {
    async fetchUsers(page = 1) {
      try {
        const response = await axios.get(`${this.baseUrl}/admin/users?page=${page}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.users = response.data.data;
        this.currentPage = response.data.current_page;
        this.totalPages = response.data.last_page;
        this.error = null;
      } catch (err) {
        console.error(err.response?.data || err);
        this.error = "Failed to load users. Admin access required.";
      }
    },

    async searchUserByEmail() {
      try {
        if (!this.searchEmail) {
          this.fetchUsers();
          return;
        }

        const response = await axios.get(
          `${this.baseUrl}/admin/users/search?email=${this.searchEmail}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        this.users = response.data.data;
        this.currentPage = response.data.current_page || 1;
        this.totalPages = response.data.last_page || 1;
        this.error = null;
      } catch (err) {
        console.error(err.response?.data || err);
        this.error = err.response?.data?.message || "No matching users found.";
        this.users = [];
      }
    },

    onSearchInput() {
      if (!this.searchEmail) {
        this.fetchUsers(); 
      }
    },
  },
  computed: {
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;

      let start = Math.max(current - 4, 1);
      let end = Math.min(start + 9, total);

      if (end - start < 9) {
        start = Math.max(end - 9, 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.table {
  width: 100%;
  table-layout: fixed;
  /* keeps table size consistent */
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.table th {
  background-color: #a5d6a7;
  font-weight: bold;
}

.table th:nth-child(1),
.table td:nth-child(1) {
  width: 5%;
}

.table th:nth-child(2),
.table td:nth-child(2) {
  width: 20%;
}

.table th:nth-child(3),
.table td:nth-child(3) {
  width: 15%;
}

.table th:nth-child(4),
.table td:nth-child(4) {
  width: 20%;
}

.table th:nth-child(5),
.table td:nth-child(5) {
  width: 20%;
}

.table th:nth-child(6),
.table td:nth-child(6) {
  width: 20%;
}
</style>
