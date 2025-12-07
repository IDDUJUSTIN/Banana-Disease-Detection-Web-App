<template>
  <div class="profile">
    <div class="profile-header">
      <h2>My Profile</h2>
      <!-- Pencil icon navigates to EditPage -->
      <button class="edit-icon" @click="goToEdit">
        <i class="fas fa-edit"></i>
      </button>

    </div>

    <!-- Display mode only -->
    <div>
      <div class="profile-field">
        <label>Full Name:</label>
        <span>{{ form.fullname }}</span>
      </div>

      <div class="profile-field">
        <label>Username:</label>
        <span>{{ form.username }}</span>
      </div>

      <div class="profile-field">
        <label>Contact Number:</label>
        <span>{{ form.contact_number }}</span>
      </div>
    </div>
  </div>
</template>


<script>
import api from "@/axios";

export default {
  name: "ProfilePage",
  data() {
    return {
      form: {
        fullname: "",
        username: "",
        contact_number: "",
      },
    };
  },
  async mounted() {
    try {
      const res = await api.get("profile");
      const { fullname, username, contact_number } = res.data;
      this.form.fullname = fullname;
      this.form.username = username;
      this.form.contact_number = contact_number;
    } catch (err) {
      console.error("Failed to load profile:", err);
      alert("Could not load profile data");
    }
  },
  methods: {
    goToEdit() {
      // Navigate to your EditPage route
      this.$router.push({ name: "EditPage" });
    },
  },
};
</script>


<style scoped>
.profile {
  max-width: 480px;
  margin: 50px auto;
  background: linear-gradient(135deg, #ffffff, #f9f9f9);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  font-family: "Segoe UI", Roboto, sans-serif;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.profile-header h2 {
  font-size: 1.6rem;
  color: #1565c0;
  font-weight: 600;
}

.edit-icon {
  background: #e3f2fd;
  border: 2px solid #1565c0;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  padding: 6px 10px;
  transition: all 0.3s ease;
}

.edit-icon:hover {
  background: #1565c0;
  color: #fff;
}

.profile-field {
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-field label {
  font-weight: 600;
  color: #333;
}

.profile-field span {
  color: #555;
  font-size: 1rem;
}

.profile-field input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #90caf9;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s ease;
}

.profile-field input:focus {
  border-color: #1565c0;
}

/* Buttons */
.update-btn,
.save-btn,
.cancel-btn {
  margin-top: 20px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.update-btn {
  background: #4caf50;
  color: white;
}

.update-btn:hover {
  background: #388e3c;
}

.save-btn {
  background: #2196f3;
  color: white;
  margin-right: 10px;
}

.save-btn:hover {
  background: #1976d2;
}

.cancel-btn {
  background: #f44336;
  color: white;
}

.cancel-btn:hover {
  background: #c62828;
}
</style>
