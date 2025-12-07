<template>
  <div class="history-container">
    <h2 class="text-center mb-4">
      <i class="fas fa-history"></i> Prediction History
    </h2>

    <table class="table table-striped table-hover">
      <thead class="table-success">
        <tr>
          <th>#</th>
          <th>Photo</th>
          <th>Prediction</th>
          <th>Confidence</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in history" :key="item.id">
          <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td>
            <img :src="item.url" :alt="item.filename || 'Image'" class="preview-img" v-if="item.url"
              @error="onImageError" />
            <span v-else class="text-muted">No image</span>
          </td>
          <td>{{ item.prediction || 'Unknown' }}</td>
          <td>{{ (item.confidence_level * 100).toFixed(2) }}%</td>
          <td>{{ new Date(item.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <!-- Pagination Controls -->
<div class="d-flex justify-content-between align-items-center mt-4">
  <button
    class="btn btn-outline-success"
    :disabled="currentPage === 1"
    @click="fetchHistory(currentPage - 1)"
  >
    ← Previous
  </button>

  <!-- Dynamic Page Numbers -->
  <div>
    <button
      v-for="page in visiblePages"
      :key="page"
      class="btn btn-sm"
      :class="page === currentPage ? 'btn-success' : 'btn-outline-success'"
      @click="fetchHistory(page)"
    >
      {{ page }}
    </button>
  </div>

  <button
    class="btn btn-outline-success"
    :disabled="currentPage === totalPages"
    @click="fetchHistory(currentPage + 1)"
  >
    Next →
  </button>
</div>

  </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";

export default {
  name: "HistoryPage",
  data() {
    return {
      baseUrl: inject("baseUrl"),
      history: [],
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
    };
  },
  async mounted() {
    this.fetchHistory(1);
  },
  methods: {
    async fetchHistory(page = 1) {
      try {
        const response = await axios.get(
          `${this.baseUrl}/descriptive?page=${page}&per_page=${this.perPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        this.history = response.data.data;
        this.currentPage = response.data.current_page;
        this.totalPages = response.data.last_page;
      } catch (error) {
        console.error("Error loading history:", error.response?.data || error);
      }
    },
    onImageError(event) {
      event.target.style.display = "none";
    },
  },
  computed: {
  visiblePages() {
    const pages = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 10; // show up to 10 pages

    // Center current page in the window
    let start = current - Math.floor(maxVisible / 2);
    let end = current + Math.floor(maxVisible / 2);

    // Adjust if start < 1
    if (start < 1) {
      start = 1;
      end = Math.min(maxVisible, total);
    }

    // Adjust if end > total
    if (end > total) {
      end = total;
      start = Math.max(total - maxVisible + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}

};
</script>

<style scoped>
.history-container {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.preview-img {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
  margin: 0 auto;
}

.text-muted {
  color: #6c757d;
  font-style: italic;
}
</style>
