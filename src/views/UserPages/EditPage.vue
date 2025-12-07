<template>
  <div class="edit-profile">
    <h2>Edit Profile</h2>

    <form @submit.prevent="saveProfile">
      <div class="form-group">
        <label>First Name</label>
        <input v-model="form.first_name" type="text" />
      </div>

      <div class="form-group">
        <label>Middle Name</label>
        <input v-model="form.middle_name" type="text" />
      </div>

      <div class="form-group">
        <label>Last Name</label>
        <input v-model="form.last_name" type="text" />
      </div>

      <div class="form-group">
        <label>Username</label>
        <input v-model="form.username" type="text" />
      </div>

      <div class="form-group">
        <label>Contact Number</label>
        <input v-model="form.contact_number" type="text" />
      </div>

      <!-- Button group below form -->
      <div class="button-group">
        <button type="button" class="back-btn" @click="$router.back()">Back</button>
        <button type="submit" class="save-btn">Save</button>
      </div>
    </form>
  </div>
</template>


<script>
import api from "@/axios";
import router from "@/router";

export default {
  name: "EditPage",
  data() {
    return {
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        username: "",
        contact_number: "",
      },
    };
  },
  async mounted() {
    try {
      // Load profile data from backend
      const { data } = await api.get("update"); // ✅ use correct endpoint

      // Directly assign separate fields
      this.form.first_name = data.first_name || "";
      this.form.middle_name = data.middle_name || "";
      this.form.last_name = data.last_name || "";
      this.form.username = data.username || "";
      this.form.contact_number = data.contact_number || "";
    } catch (err) {
      console.error("Failed to load profile:", err);
      alert("Could not load profile data");
    }
  },
  methods: {
    async saveProfile() {
      try {
        const res = await api.put("update", this.form);
        alert(res.data.message);
        console.log("Updated user:", res.data.user);
        router.push({ name: "ProfilePage" });
      } catch (err) {
        console.error("Failed to update profile:", err);
        alert("Could not update profile");
      }
    },
  },
};
</script>


<style scoped>
.edit-profile {
  max-width: 480px;
  margin: 50px auto;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  font-family: "Segoe UI", Roboto, sans-serif;
}

.edit-profile h2 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1565c0;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #90caf9;
  border-radius: 8px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #1565c0;
}

/* Button group layout */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.back-btn,
.save-btn {
  flex: 1;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.back-btn {
  background: #f44336;
  color: white;
  margin-right: 12px;
}

.back-btn:hover {
  background: #c62828;
}

.save-btn {
  background: #2196f3;
  color: white;
}

.save-btn:hover {
  background: #1976d2;
}
</style>
