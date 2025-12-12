<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">🌿 Plant Disease Detection</h1>
      <p class="subtitle">Login to access the system</p>

      <div class="input-wrapper">
        <i class="fas fa-user icon"></i>
        <input type="text" placeholder="Username" v-model="username" class="input-field" />
      </div>

      <div class="input-wrapper">
        <i class="fas fa-envelope icon"></i>
        <input type="text" placeholder="Email" v-model="email" class="input-field" />
      </div>

      <div class="input-wrapper">
        <i class="fas fa-lock icon"></i>
        <input :type="showPassword ? 'text' : 'password'" placeholder="Password" v-model="password"
          class="input-field" />
        <i :class="showPassword ? 'fas fa-eye-slash toggle-eye' : 'fas fa-eye toggle-eye'" @click="togglePassword"></i>
      </div>



      <button type="button" class="btn login-btn" @click="login">Log in</button>


      <button type="button" class="btn signup-btn" @click="goToRegister">Sign up</button>
      <p class="signup-prompt">Don't have an account yet?</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";

export default {
  name: "LoginPage",
  data() {
  return {
    baseUrl: inject("baseUrl"),
    username: "",
    email: "",
    password: "",
    showPassword: false, // 👁️ toggle state
  };
},


  methods: {
    togglePassword() {
    this.showPassword = !this.showPassword;
  },
    login() {
      axios
        .post(this.baseUrl + "/login", {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          if (response.status === 200) {
            const user = response.data.user;

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user_id", user.id);
            localStorage.setItem("role", user.role);

            if (user.role === "admin") {
              this.$router.push("/admin");
            } else {
              this.$router.push("/main");
            }
          } else {
            alert("Invalid credentials!");
          }
        })
        .catch((error) => {
          console.error(error.response?.data || error);
          alert("Login failed!");
        });
    },

    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style scoped>
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

.input {
  width: 100%;
  padding: 0.85rem;
  margin: 0.6rem 0;
  border: 1px solid #c8e6c9;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
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
.toggle-eye {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  cursor: pointer;
  color: #2e7d32;
  font-size: 1rem;
}
/* Prevent duplicate eye icon */
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}

input[type="password"]::-webkit-textfield-decoration-container {
  display: none;
}



.login-btn {
  background: #a5d6a7;
  color: #2e7d32;
}

.login-btn:hover {
  background: #81c784;
  transform: scale(1.02);
}

.signup-btn {
  background: #2e7d32;
  color: #fff;
}

.signup-btn:hover {
  background: #1b5e20;
  transform: scale(1.02);
}

.input-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  /* left padding for icon */
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background: #f1f8e9;
  box-sizing: border-box;
}

.icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #2e7d32;
  font-size: 1rem;
}
</style>
