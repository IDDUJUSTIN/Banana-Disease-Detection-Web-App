<template>
  <div class="dashboard-container">
    <h2 class="text-center mb-4">
      <i class="fas fa-tachometer-alt"></i> Dashboard
    </h2>


    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Predictions</h3>
        <p>{{ overall }}</p>
      </div>
      <div class="stat-card">
        <h3>Banana Panama Disease</h3>
        <p>{{ stats.panama }}</p>
      </div>
      <div class="stat-card">
        <h3>Black Sigatoka Disease</h3>
        <p>{{ stats.blackSigatoka }}</p>
      </div>
      <div class="stat-card">
        <h3>Yellow Sigatoka Disease</h3>
        <p>{{ stats.yellowSigatoka }}</p>
      </div>
    </div>

    <!-- Recent Predictions Table -->
    <div class="card shadow-sm mt-4">
      <div class="card-body">
        <h4 class="mb-3">
          <i class="fas fa-image"></i> Recent Predictions
        </h4>

        <table class="table table-striped table-hover">
          <thead class="table-success">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Photo</th>
              <th>Prediction</th>
              <th>Confidence</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in recentPredictions" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.username }}</td>
              <td>
                <img :src="item.url" :alt="item.filename || 'Image'" class="preview-img" v-if="item.url"
                  @error="onImageError" />
                <span v-else class="text-muted">No image</span>
              </td>
              <td>{{ item.prediction }}</td>
              <td>{{ (item.confidence_level * 100).toFixed(2) }}%</td>
              <td>{{ new Date(item.created_at).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <div class="d-flex justify-content-between mt-4">
          <button class="btn btn-outline-success" :disabled="currentPage === 1" @click="fetchLogs(currentPage - 1)">
            ← Previous
          </button>
          <span class="text-muted">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-outline-success" :disabled="currentPage === totalPages"
            @click="fetchLogs(currentPage + 1)">
            Next →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { inject } from "vue";

export default {
  name: "DashboardPage",
  data() {
    return {
      baseUrl: inject("baseUrl"),
      overall: 0,
      stats: {
        panama: 0,
        blackSigatoka: 0,
        yellowSigatoka: 0,
      },
      recentPredictions: [],

      // pagination state
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
    };
  },
  async mounted() {
    try {
      // Fetch stats
      const statsResponse = await axios.get(this.baseUrl + "/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      this.overall = statsResponse.data.overall;
      this.stats = { panama: 0, blackSigatoka: 0, yellowSigatoka: 0 };

      statsResponse.data.breakdown.forEach(item => {
        if (item.prediction.toLowerCase().includes("panama")) {
          this.stats.panama = item.total;
        } else if (item.prediction.toLowerCase().includes("black")) {
          this.stats.blackSigatoka = item.total;
        } else if (item.prediction.toLowerCase().includes("yellow")) {
          this.stats.yellowSigatoka = item.total;
        }
      });

      // Fetch first page of predictions
      this.fetchLogs(1);
    } catch (error) {
      console.error(error.response?.data || error);
    }
  },
  methods: {
    async fetchLogs(page = 1) {
      try {
        const response = await axios.get(
          `${this.baseUrl}/descriptive?page=${page}&per_page=${this.perPage}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Laravel paginator returns { data, current_page, last_page, ... }
        this.recentPredictions = response.data.data;
        this.currentPage = response.data.current_page;
        this.totalPages = response.data.last_page;
      } catch (error) {
        console.error(error.response?.data || error);
      }
    },

    getImageUrl(path) {
      if (!path) return "";
      if (/^https?:\/\//i.test(path)) return path;

      const host = this.baseUrl.replace(/\/api\/?$/i, "");
      let p = path;
      if (p.startsWith("/")) p = p.slice(1);

      if (p.startsWith("storage")) {
        return `${host}/${p}`;
      }

      if (p.startsWith("public/")) {
        p = p.replace(/^public\//, "");
        return `${host}/${p}`;
      }

      return `${host}/storage/${p}`;
    },
  },
};

</script>



<style scoped>
.dashboard-container {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.stat-card {
  flex: 1;
  background: #e8f5e9;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(46, 125, 50, 0.2);
}

.stat-card h3 {
  color: #2e7d32;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1b5e20;
}

.card {
  border-radius: 12px;
}

.preview-img {
  width: 120px;
  /* fixed width */
  height: 120px;
  /* fixed height */
  border-radius: 8px;
  object-fit: cover;
  /* ensures image fills box without distortion */
  display: block;
  margin: 0 auto;
  /* optional: center inside cell */
}
</style>
