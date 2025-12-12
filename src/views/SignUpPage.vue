<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">🌿 Plant Disease Detection</h1>
      <p class="subtitle">Create your account</p>

     
      <div class="input-wrapper">
        <i class="fas fa-user"></i>
        <input type="text" placeholder="First Name" v-model="first_name" class="input" />
      </div>
      <p v-if="errors.first_name" class="error">{{ errors.first_name }}</p>

      
      <div class="input-wrapper">
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Middle Name" v-model="middle_name" class="input" />
      </div>
      <p v-if="errors.middle_name" class="error">{{ errors.middle_name }}</p>

      
      <div class="input-wrapper">
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Last Name" v-model="last_name" class="input" />
      </div>
      <p v-if="errors.last_name" class="error">{{ errors.last_name }}</p>

    
      <div class="input-wrapper">
        <i class="fas fa-phone"></i>
        <input type="text" placeholder="Contact Number" v-model="contact_number" class="input" />
      </div>
      <p v-if="errors.contact_number" class="error">{{ errors.contact_number }}</p>

     
      <div class="input-wrapper">
        <i class="fas fa-envelope"></i>
        <input type="text" placeholder="Email" v-model="email" class="input" />
      </div>
      <p v-if="errors.email" class="error">{{ errors.email }}</p>

     
      <div class="input-wrapper">
        <i class="fas fa-user-circle"></i>
        <input type="text" placeholder="Username" v-model="username" class="input" />
      </div>
      <p v-if="errors.username" class="error">{{ errors.username }}</p>

     
      <div class="input-wrapper">
        <i class="fas fa-lock"></i>
        <input :type="showPassword ? 'text' : 'password'" placeholder="Password" v-model="password" class="input" />
        <i :class="showPassword ? 'fas fa-eye-slash toggle-eye' : 'fas fa-eye toggle-eye'" @click="togglePassword"></i>
      </div>
      <p class="note">At least 8 chars, 1 uppercase, 1 number, 1 special.</p>
      <p v-if="errors.password" class="error">{{ errors.password }}</p>

      
      <div class="input-wrapper">
        <i class="fas fa-lock"></i>
        <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm Password" v-model="password_confirmation" class="input" />
        <i :class="showConfirmPassword ? 'fas fa-eye-slash toggle-eye' : 'fas fa-eye toggle-eye'" @click="toggleConfirmPassword"></i>
      </div>
      <p v-if="errors.password_confirmation" class="error">{{ errors.password_confirmation }}</p>

     
      <button type="button" class="btn signup-btn" @click="register">Sign up</button>
      <button type="button" class="btn login-btn" @click="goToLogin">Back to Login</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";

export default {
  name: "RegisterPage",
  data() {
    return {
      baseUrl: inject("baseUrl"),
      first_name: "",
      middle_name: "",
      last_name: "",
      contact_number: "",
      email: "",
      username: "",
      password: "",
      password_confirmation: "",
      errors: {},
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async register() {
      this.errors = {};
      try {
        const response = await axios.post(this.baseUrl + "/register", {
          first_name: this.first_name,
          middle_name: this.middle_name,
          last_name: this.last_name,
          contact_number: this.contact_number,
          email: this.email,
          username: this.username,
          password: this.password,
          password_confirmation: this.password_confirmation,
        });

        if (response.status === 200 || response.status === 201) {
          alert("Registration successful!");
          this.$router.push("/");
        }
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          alert("Registration failed!");
        }
      }
    },
    goToLogin() {
      this.$router.push("/");
    },
  },
};
</script>


<style scoped>
@import "@fortawesome/fontawesome-free/css/all.css";

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #dcedc8, #a5d6a7);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
}

.register-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.register-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.title {
  color: #2e7d32;
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #4caf50;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.input-wrapper i {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #2e7d32;
  font-size: 1rem;
}

.input-wrapper i:first-child {
  left: 0.85rem; /* lock/user/email icons */
}

.toggle-eye {
  position: absolute;
  top: 50%;
  right: 0.85rem;
  transform: translateY(-50%);
  cursor: pointer;
  color: #2e7d32;
  font-size: 1rem;
}


.input {
  width: 100%;
  padding: 0.85rem 2.5rem; /* space for icons */
  border: 1px solid #c8e6c9;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  background: #f9fff9;
}

.input:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 8px rgba(46, 125, 50, 0.3);
}

.btn {
  width: 100%;
  padding: 0.85rem;
  margin-top: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.signup-btn {
  background: #2e7d32;
  color: #fff;
}

.signup-btn:hover {
  background: #1b5e20;
  transform: scale(1.02);
}

.login-btn {
  background: #a5d6a7;
  color: #2e7d32;
}

.login-btn:hover {
  background: #81c784;
  transform: scale(1.02);
}

.note {
  font-size: 0.75rem;
  color: #666;
  margin-top: -0.3rem;
  text-align: left;
}

.error {
  font-size: 0.8rem;
  color: #d32f2f;
  margin-top: -0.2rem;
  text-align: left;
}
/* Prevent duplicate eye icon */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

input[type="password"]::-webkit-textfield-decoration-container {
  display: none;
}

</style>
