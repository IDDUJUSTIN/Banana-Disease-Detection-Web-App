<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">
      <i class="fas fa-clipboard-list"></i> Activity Logs
    </h2>

    <div class="mb-4">
      <label for="searchUsername" class="form-label fw-bold"> Search by Username</label>
      <div class="input-group">
        <input type="text" id="searchUsername" v-model="searchUsername" class="form-control"
          placeholder="Enter username" @input="searchLogsByUsername" />
        <button class="btn btn-success" @click="searchLogsByUsername">
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
              <th>Action</th>
              <th>Activity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in logs" :key="log.id">
              <td>{{ index + 1 + (currentPage - 1) * 10 }}</td>
              <td>{{ log.user ? mergeFullName(log.user) : 'N/A' }}</td>
              <td>{{ log.user ? log.user.username : 'N/A' }}</td>
              <td>{{ log.action }}</td>
              <td>{{ log.activitylogs }}</td>
              <td>{{ new Date(log.created_at).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>

        <div class="d-flex justify-content-between align-items-center mt-4">
          <button class="btn btn-outline-success" :disabled="currentPage === 1" @click="fetchLogs(currentPage - 1)">
            ← Previous
          </button>
          <div>
            <button v-for="page in visiblePages" :key="page" class="btn btn-sm"
              :class="page === currentPage ? 'btn-success' : 'btn-outline-success'" @click="fetchLogs(page)">
              {{ page }}
            </button>
          </div>

          <button class="btn btn-outline-success" :disabled="currentPage === totalPages"
            @click="fetchLogs(currentPage + 1)">
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
  name: "ActivityLogsPage",
  data() {
    return {
      baseUrl: inject("baseUrl"),
      logs: [],
      error: null,
      currentPage: 1,
      totalPages: 1,
      searchUsername: "", 
    };
  },
  methods: {
    mergeFullName(user) {
      return `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`;
    },
    async fetchLogs(page = 1) {
      try {
        const response = await axios.get(`${this.baseUrl}/admin/activity-logs?page=${page}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.logs = response.data.data;
        this.currentPage = response.data.current_page;
        this.totalPages = response.data.last_page;
        this.error = null;
      } catch (err) {
        console.error(err.response?.data || err);
        this.error = "Failed to load activity logs. Admin access required.";
      }
    },
    async searchLogsByUsername() {
      try {
        if (!this.searchUsername) {
          this.fetchLogs();
          return;
        }
        const response = await axios.get(
          `${this.baseUrl}/admin/activity-logs/search?username=${this.searchUsername}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        this.logs = response.data.data;
        this.currentPage = response.data.current_page || 1;
        this.totalPages = response.data.last_page || 1;
        this.error = null;
      } catch (err) {
        console.error(err.response?.data || err);
        this.error = "No matching logs found.";
        this.logs = [];
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
    }
  },
  mounted() {
    this.fetchLogs(); 
  },
};
</script>




<style scoped>
.table {
  width: 100%;
  table-layout: fixed;
  /* ensures fixed column widths */
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-overflow: ellipsis;
  /* truncate long text */
  overflow: hidden;
  white-space: nowrap;
  /* prevent wrapping */
}

.table th {
  background-color: #a5d6a7;
  font-weight: bold;
}

/* Example fixed widths per column */
.table th:nth-child(1),
.table td:nth-child(1) {
  width: 5%;
  /* ID column */
}

.table th:nth-child(2),
.table td:nth-child(2) {
  width: 15%;
  /* Full Name column */
}

.table th:nth-child(3),
.table td:nth-child(3) {
  width: 15%;
  /* Username column */
}

.table th:nth-child(4),
.table td:nth-child(4) {
  width: 15%;
  /* Action column */
}

.table th:nth-child(5),
.table td:nth-child(5) {
  width: 30%;
  /* Activity/Details column */
}

.table th:nth-child(6),
.table td:nth-child(6) {
  width: 20%;
  /* Date column */
}
</style>
