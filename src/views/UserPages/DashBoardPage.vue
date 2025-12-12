<template>
  <div class="dashboard-container">
    <h2 class="text-center mb-4">
      <i class="fas fa-chart-line"></i> Dashboard
    </h2>

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

    <div class="text-center mt-4">
      <button @click="showForm = !showForm" class="btn btn-primary">
        {{ showForm ? '❌ Cancel' : '➕ Add Farm Location for Weather Update' }}
      </button>
    </div>

    <div v-if="showForm" class="location-form card p-4 shadow-sm mt-3">
      <h4 class="mb-3 text-success fw-bold">
        <i class="fas fa-map-marker-alt"></i> Add New Farm Location
      </h4>

      <div class="mb-3">
        <label class="form-label">Province</label>
        <input v-model="form.province" placeholder="Enter province" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">City</label>
        <input v-model="form.city" placeholder="Enter city" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Barangay</label>
        <input v-model="form.barangay" placeholder="Enter barangay" class="form-control" />
      </div>

      <button @click="saveLocation" class="btn btn-success w-100">
        Save Location
      </button>
    </div>

    <div v-if="visibleWeatherList.length" class="weather-section mt-4">
      <div v-for="w in visibleWeatherList" :key="w.id" class="weather-location">
        <div v-if="editingId === w.id" class="edit-form card p-3 mb-3">
          <h4 class="text-primary mb-3"> Edit Location</h4>
          <div class="mb-2">
            <label class="form-label">Province</label>
            <input v-model="editForm.province" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">City</label>
            <input v-model="editForm.city" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">Barangay</label>
            <input v-model="editForm.barangay" class="form-control" />
          </div>
          <div class="d-flex gap-2">
            <button @click="updateLocation(w.id)" class="btn btn-success"> Save</button>
            <button @click="cancelEdit" class="btn btn-secondary"> Cancel</button>
          </div>
        </div>

        <div v-else>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="weather-location-title mb-0">
              <i class="fas fa-map-marker-alt"></i>
              {{ w.barangay }}, {{ w.city }}, {{ w.province }}
            </h3>

            <div class="btn-group">
              <button @click="startEdit(w)" class="btn btn-sm btn-outline-primary" title="Edit location">
                Edit
              </button>
              <button @click="hideLocation(w.id)" class="btn btn-sm btn-outline-warning" title="Hide from view">
                Hide
              </button>
            </div>
          </div>

          <div class="weather-metrics">
            <div class="weather-card">
              <h4>Condition</h4>
              <p>{{ w.condition }}</p>
            </div>
            <div class="weather-card">
              <h4>Temperature</h4>
              <p>{{ w.temperature }} °C</p>
            </div>
            <div class="weather-card">
              <h4>Humidity</h4>
              <p>{{ w.humidity }} %</p>
            </div>
            <div class="weather-card">
              <h4>Wind Speed</h4>
              <p>{{ w.wind_speed }} m/s</p>
            </div>
          </div>
          <div class="weather-card recommendation">
            <h4>Spray Recommendation</h4>
            <p>{{ getSprayRecommendation(w) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hiddenWeatherList.length" class="hidden-section mt-4">
      <h3 class="mb-3 text-center text-secondary"> Hidden Locations</h3>
      <div class="hidden-list">
        <div v-for="h in hiddenWeatherList" :key="h.id" class="hidden-item card p-3 mb-2">
          <div class="d-flex justify-content-between align-items-center">
            <span> {{ h.barangay }}, {{ h.city }}, {{ h.province }}</span>
            <button @click="showLocation(h.id)" class="btn btn-sm btn-success">
              Show
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm mt-4">
      <div class="card-body">
        <h4 class="mb-3">
          <i class="fas fa-chart-line"></i> Disease Forecast (Straight-Line)
        </h4>

        <canvas id="forecastChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "DashboardPage",
  data() {
    return {
      baseUrl: inject("baseUrl"),
      overall: 0,
      stats: { panama: 0, blackSigatoka: 0, yellowSigatoka: 0 },
      showForm: false,
      form: { province: "", city: "", barangay: "" },
      allWeatherLocations: [],
      hiddenLocationIds: [],
      editingId: null,
      editForm: { province: "", city: "", barangay: "" },
      forecastChart: null, // Chart.js instance
    };
  },

  computed: {
    visibleWeatherList() {
      return this.allWeatherLocations.filter(
        (loc) => !this.hiddenLocationIds.includes(loc.id)
      );
    },
    hiddenWeatherList() {
      return this.allWeatherLocations.filter((loc) =>
        this.hiddenLocationIds.includes(loc.id)
      );
    },
  },

  async mounted() {
    try {
      const statsResponse = await axios.get(this.baseUrl + "/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      this.overall = statsResponse.data.overall;

      this.stats = { panama: 0, blackSigatoka: 0, yellowSigatoka: 0 };
      statsResponse.data.breakdown.forEach((item) => {
        const prediction = item.prediction.toLowerCase();
        if (prediction.includes("panama")) {
          this.stats.panama = item.total;
        } else if (prediction.includes("black")) {
          this.stats.blackSigatoka = item.total;
        } else if (prediction.includes("yellow")) {
          this.stats.yellowSigatoka = item.total;
        }
      });

      const weatherResponse = await axios.get(this.baseUrl + "/weather", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const rawData = Array.isArray(weatherResponse.data)
        ? weatherResponse.data
        : [];
      this.allWeatherLocations = rawData.map((location, index) => ({
        id: location.id || location._id || `temp-${index}`,
        barangay: location.barangay,
        city: location.city,
        province: location.province,
        condition: location.condition,
        temperature: location.temperature,
        humidity: location.humidity,
        wind_speed: location.wind_speed,
      }));

      const storedHiddenIds = localStorage.getItem("hiddenLocations");
      this.hiddenLocationIds = storedHiddenIds ? JSON.parse(storedHiddenIds) : [];

      await this.fetchForecast();
    } catch (error) {
      console.error("Error loading dashboard:", error.response?.data || error);
    }
  },

  methods: {
    async saveLocation() {
      if (!this.form.province || !this.form.city || !this.form.barangay) {
        alert("Please fill in all fields");
        return;
      }
      try {
        const response = await axios.post(this.baseUrl + "/weather", this.form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const newLocation = {
          id: response.data.id,
          barangay: response.data.location.barangay,
          city: response.data.location.city,
          province: response.data.location.province,
          condition: response.data.weather.condition,
          temperature: response.data.weather.temperature,
          humidity: response.data.weather.humidity,
          wind_speed: response.data.weather.wind_speed,
        };
        this.allWeatherLocations.push(newLocation);
        this.form = { province: "", city: "", barangay: "" };
        this.showForm = false;
      } catch (error) {
        console.error(error.response?.data || error);
        alert(
          "Error saving location: " +
          (error.response?.data?.message || "Unknown error")
        );
      }
    },

    startEdit(location) {
      this.editingId = location.id;
      this.editForm = {
        province: location.province,
        city: location.city,
        barangay: location.barangay,
      };
    },
    cancelEdit() {
      this.editingId = null;
      this.editForm = { province: "", city: "", barangay: "" };
    },

    async updateLocation(locationId) {
      if (
        !this.editForm.province ||
        !this.editForm.city ||
        !this.editForm.barangay
      ) {
        alert("Please fill in all fields");
        return;
      }
      try {
        const response = await axios.put(
          `${this.baseUrl}/weather/${locationId}`,
          this.editForm,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        const index = this.allWeatherLocations.findIndex(
          (w) => w.id === locationId
        );
        if (index !== -1) {
          this.allWeatherLocations[index] = {
            ...this.allWeatherLocations[index],
            barangay: response.data.location.barangay,
            city: response.data.location.city,
            province: response.data.location.province,
            condition: response.data.weather.condition,
            temperature: response.data.weather.temperature,
            humidity: response.data.weather.humidity,
            wind_speed: response.data.weather.wind_speed,
          };
        }
        this.cancelEdit();
      } catch (error) {
        console.error("Error updating location:", error.response?.data || error);
        alert(
          "Error updating location: " +
          (error.response?.data?.message || "Unknown error")
        );
      }
    },

    hideLocation(locationId) {
      if (!this.hiddenLocationIds.includes(locationId)) {
        this.hiddenLocationIds.push(locationId);
        localStorage.setItem(
          "hiddenLocations",
          JSON.stringify(this.hiddenLocationIds)
        );
      }
    },
    showLocation(locationId) {
      this.hiddenLocationIds = this.hiddenLocationIds.filter(
        (id) => id !== locationId
      );
      localStorage.setItem(
        "hiddenLocations",
        JSON.stringify(this.hiddenLocationIds)
      );
    },

    getSprayRecommendation(weather) {
      const condition = weather.condition.toLowerCase();
      const wind = weather.wind_speed;
      const temp = weather.temperature;
      const humidity = weather.humidity;

      if (condition.includes("rain") || humidity > 85) {
        return "🌧️ Rainy/High Humidity — Do NOT spray.";
      }
      if (wind < 1.5) {
        return "🌬️ Calm (<1.5 m/s) — Wait until steady breeze.";
      } else if (wind > 5) {
        return "💨 Windy (>5 m/s) — Avoid spraying.";
      }
      if (temp < 15) {
        return "❄️ Cold (<15°C) — Delay spraying.";
      } else if (temp > 30) {
        return "🔥 Hot (>30°C) — Avoid spraying.";
      }
      if (condition.includes("sun") || condition.includes("clear")) {
        return "☀️ Sunny/Clear — Safe to spray.";
      }
      if (condition.includes("cloud") || condition.includes("overcast")) {
        return "⛅ Cloudy/Dry — Spraying acceptable.";
      }
      return "ℹ️ Moderate conditions — Spraying acceptable.";
    },

    // Forecast chart method
    async fetchForecast() {
      try {
        const response = await axios.get(this.baseUrl + "/mstat", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const raw = response.data.breakdown || [];

        // 1) Group totals per disease by month
        const grouped = {};
        raw.forEach((item) => {
          const disease = item.prediction.toLowerCase();
          if (!grouped[disease]) grouped[disease] = {};
          grouped[disease][item.month] = item.total;
        });

        // 2) Collect and sort unique months
        const allMonths = Array.from(new Set(raw.map(r => r.month))).sort();
        if (allMonths.length < 2) {
          console.warn("Need at least 2 actual months to compute forecast.");
          return;
        }

        // Take the last two actual months
        const prevActualMonth = allMonths[allMonths.length - 2];
        const currActualMonth = allMonths[allMonths.length - 1];

        // 3) Build forecast months (next 3 after current actual)
        const [cy, cm] = currActualMonth.split("-");
        const currYear = parseInt(cy);
        const currMonthIndex = parseInt(cm) - 1;

        const forecastMonths = [];
        for (let i = 1; i <= 3; i++) {
          const year = currYear + Math.floor((currMonthIndex + i) / 12);
          const month = ((currMonthIndex + i) % 12) + 1;
          forecastMonths.push(`${year}-${month.toString().padStart(2, "0")}`);
        }

        // Final rolling window: 2 actual + 3 forecast
        const rollingMonths = [prevActualMonth, currActualMonth, ...forecastMonths];

        // 4) Labels
        const mName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const labels = rollingMonths.map(m => {
          const [yy, mm] = m.split("-");
          return `${mName[parseInt(mm) - 1]} ${yy}`;
        });

        // 5) Build datasets
        const datasets = [];
        const colors = {
          panama: "rgba(255,99,132,1)",
          black: "rgba(54,162,235,1)",
          yellow: "rgba(255,206,86,1)",
        };

        Object.keys(grouped).forEach((disease) => {
          const prevVal = grouped[disease]?.[prevActualMonth] ?? null;
          const currVal = grouped[disease]?.[currActualMonth] ?? null;

          if (prevVal == null || currVal == null) return;

          // Straight-line rate: (curr - prev) / curr
          const diff = currVal - prevVal;
          const rate = currVal === 0 ? 0 : diff / currVal;

          // Forecast chain
          const f1 = Math.round(currVal * (1 + rate));
          const f2 = Math.round(f1 * (1 + rate));
          const f3 = Math.round(f2 * (1 + rate));

          const actualData = [prevVal, currVal, null, null, null];
          const forecastData = [null, null, f1, f2, f3];

          const colorKey =
            disease.includes("panama") ? "panama" :
              disease.includes("black") ? "black" : "yellow";

          datasets.push({
            label: disease + " (Actual)",
            data: actualData,
            borderColor: colors[colorKey],
            backgroundColor: "rgba(0,0,0,0.1)",
            tension: 0.25,
            borderWidth: 2,
            pointRadius: 4,
          });

          datasets.push({
            label: disease + " (Forecast)",
            data: forecastData,
            borderColor: colors[colorKey],
            backgroundColor: "transparent",
            borderDash: [6, 6],
            tension: 0.25,
            borderWidth: 2,
            pointRadius: 4,
          });
        });

        // 6) Render chart
        const canvas = document.getElementById("forecastChart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (this.forecastChart) this.forecastChart.destroy();

        this.forecastChart = new Chart(ctx, {
          type: "line",
          data: { labels, datasets },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "bottom" },
              title: { display: true, text: `Disease Forecast (Window: ${labels[0]} → ${labels[labels.length - 1]})` },
            },
            scales: {
              x: { title: { display: true, text: "Month" } },
              y: { beginAtZero: true, title: { display: true, text: "Total cases" } },
            },
          },
        });
      } catch (error) {
        console.error("Error loading forecast:", error);
      }
    }

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

/* Existing dashboard styles remain unchanged */

/* Weather Section */
.weather-location {
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.weather-location-title {
  text-align: center;
  margin-bottom: 1rem;
  color: #1565c0;
  font-weight: bold;
}

/* Default: vertical stack */
.weather-metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Weather card style */
.weather-card {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(30, 136, 229, 0.2);
}

.weather-card h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #0d47a1;
}

.weather-card p {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1565c0;
}

/* Responsive: switch to row layout on wider screens */
@media (min-width: 768px) {
  .weather-metrics {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .weather-card {
    flex: 1;
    min-width: 180px;
  }
}

.weather-card.recommendation {
  background: #fff8e1;
  /* light yellow for emphasis */
  border: 2px solid #fbc02d;
  margin-top: 1rem;
}

.weather-card.recommendation h4 {
  color: #f57f17;
}

.weather-card.recommendation p {
  color: #e65100;
  font-weight: bold;
}

.location-form {
  border-radius: 8px;
  background-color: #f9fcf9;
  transition: box-shadow 0.3s ease;
}

.location-form:hover {
  box-shadow: 0 0 12px rgba(0, 128, 0, 0.2);
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
}

.form-control {
  border-radius: 6px;
  border: 1px solid #ced4da;
  padding: 10px;
  font-size: 14px;
}

.btn-success {
  font-weight: bold;
  padding: 10px;
  border-radius: 6px;
}
</style>
