<template>
    <div class="container mt-5">
        <h2 class="text-center mb-4">
            <i class="fas fa-tasks"></i> User Actions
        </h2>


        <!-- Search by User ID -->
        <div class="mb-4">
            <label for="searchUserId" class="form-label fw-bold"> Search by User ID</label>
            <div class="input-group">
                <input type="number" id="searchUserId" v-model="searchUserId" class="form-control"
                    placeholder="Enter user ID" @input="onSearchInput" @keyup.enter="searchLogsByUserId" />
                <button class="btn btn-success" @click="searchLogsByUserId">
                    Search
                </button>
            </div>
        </div>

        <!-- Logs Table -->
        <div class="card shadow-sm">
            <div class="card-body">
                <table v-if="userActions.length > 0" class="table table-striped table-hover">
                    <thead class="table-success">
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(action, index) in userActions" :key="index">
                            <!-- Use index + 1 instead of action.id -->
                            <td>{{ index + 1 }}</td>
                            <td>{{ action.user_id }}</td>
                            <td>{{ action.action }}</td>
                            <td>{{ action.details }}</td>
                            <td>{{ new Date(action.created_at).toLocaleString() }}</td>
                        </tr>
                    </tbody>

                </table>

                <p v-else>No user actions found.</p>
            </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="alert alert-danger mt-3">
            {{ error }}
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";

export default {
    name: "UserActivityPage",
    data() {
        return {
            baseUrl: inject("baseUrl"),
            userActions: [],
            error: null,
            searchUserId: "", // search field
        };
    },
    mounted() {
        this.fetchUserActions();
    },
    methods: {
        async fetchUserActions() {
            try {
                const response = await axios.get(`${this.baseUrl}/admin/user-actions`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                this.userActions = response.data.data || response.data;
                this.error = null;
            } catch (error) {
                console.error(error.response?.data || error);
                this.error = "Failed to load user actions.";
            }
        },
        async searchLogsByUserId() {
            try {
                if (!this.searchUserId) {
                    this.fetchUserActions();
                    return;
                }
                const response = await axios.get(
                    `${this.baseUrl}/admin/user-actions/search?user_id=${this.searchUserId}`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );
                this.userActions = response.data.data || response.data;
                this.error = null;
            } catch (error) {
                console.error(error.response?.data || error);
                this.error = "No matching logs found.";
                this.userActions = [];
            }
        },
        onSearchInput() {
            if (!this.searchUserId) {
                this.fetchUserActions(); // reload all records automatically when field is cleared
            }
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 1000px;
}

.card {
    border-radius: 12px;
}

h2 {
    color: #2e7d32;
    font-weight: bold;
}

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

/* Fixed widths per column */
.table th:nth-child(1),
.table td:nth-child(1) {
    width: 10%;
}

.table th:nth-child(2),
.table td:nth-child(2) {
    width: 15%;
}

.table th:nth-child(3),
.table td:nth-child(3) {
    width: 20%;
}

.table th:nth-child(4),
.table td:nth-child(4) {
    width: 35%;
}

.table th:nth-child(5),
.table td:nth-child(5) {
    width: 20%;
}

.table-hover tbody tr:hover {
    background-color: #e8f5e9;
}
</style>
