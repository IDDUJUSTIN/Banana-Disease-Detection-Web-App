<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4"> Banana Leaf Disease Prediction</h2>

    <form @submit.prevent="predict" enctype="multipart/form-data" class="text-center">
      <!-- Upload Box -->
      <div class="upload-box mb-3" @click="triggerFileInput">
        <template v-if="preview">
          <img :src="preview" class="img-fluid rounded" style="max-width:100%; max-height:100%;" />
        </template>
        <template v-else>
          <p class="upload-text">📤 Upload your banana leaf image</p>
        </template>
        <input ref="fileInput" type="file" id="image" accept="image/*" @change="handleFileUpload" hidden />
      </div>

      <!-- Identify Button -->
      <button type="submit" class="btn btn-success btn-lg mt-3" :disabled="!formData">
        Identify Disease
      </button>
    </form>

    <hr class="my-4" />

    <!-- Prediction Result -->
    <div v-if="result" :class="['alert', resultClass]" v-html="result"></div>

    <!-- Show Treatment Button -->
    <div v-if="prediction && prediction.toLowerCase() !== 'unknown'" class="text-center mt-3">
      <button @click="showTreatment" class="btn btn-info btn-lg">
        Show Best Treatment
      </button>
    </div>

    <!-- Treatment Message -->
    <div v-if="treatmentMessage" class="alert alert-primary mt-3" v-html="treatmentMessage"></div>
  </div>
</template>

<script>
import axios from "axios";
import { inject } from "vue";

export default {
  name: "MainPage",
  data() {
    return {
      baseUrl: inject("baseUrl"),
      formData: null,
      preview: null,
      result: null,
      resultClass: "alert-success",
      prediction: null,          // store prediction
      treatmentMessage: null,    // store treatment message
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.formData = new FormData();
      this.formData.append("image", file);
      this.preview = URL.createObjectURL(file);

      // ✅ Reset previous results when new photo is uploaded
      this.result = null;
      this.prediction = null;
      this.treatmentMessage = null;
      this.resultClass = "alert-success";
    },
    async predict() {
      try {
        const response = await axios.post(this.baseUrl + "/predict", this.formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const data = response.data;
        this.prediction = data.prediction; // store prediction

        // Handle Unknown prediction (no record saved)
        if (data.prediction && data.prediction.toLowerCase() === "unknown") {
          this.resultClass = "alert-warning";
          this.result = `
            <strong>Prediction:</strong> ${data.prediction}<br>
            <strong>Confidence:</strong> ${(data.confidence_level * 100).toFixed(2)}%<br>
            <em>Record not saved because prediction was Unknown.</em>
          `;
          return;
        }

        // Normal case (record exists)
        this.resultClass = "alert-success";
        this.result = `
          <strong>Prediction:</strong> ${data.prediction}<br>
          <strong>Confidence:</strong> ${(data.confidence_level * 100).toFixed(2)}%<br>
          <strong>Uploaded:</strong> ${new Date(data.record.created_at).toLocaleString()}
        `;

      } catch (error) {
        console.error(error.response?.data || error);
        this.resultClass = "alert-danger";
        this.result = "Prediction failed. Please try again.";
      }
    },
    showTreatment() {
      const disease = this.prediction?.toLowerCase();
      switch (disease) {
        case "banana panama disease":
          this.treatmentMessage = `
        <strong>Best Treatment for Panama Disease (Fusarium Wilt):</strong><br>
        - Use resistant cultivars like GCTCV-218 or FHIA-25.<br>
        - Apply biological control agents such as *Trichoderma harzianum* to suppress soil-borne Fusarium.<br>
        - Practice strict sanitation: disinfect tools and avoid movement of contaminated soil.<br>
        - Implement crop rotation with non-host plants and improve drainage to reduce fungal persistence.
      `;
          break;

        case "banana black sigatoka disease":
          this.treatmentMessage = `
        <strong>Best Treatment for Black Sigatoka:</strong><br>
        - Apply systemic and protectant fungicides in rotation (e.g., propiconazole, mancozeb).<br>
        - Remove and destroy infected leaves to reduce inoculum.<br>
        - Maintain good canopy airflow through pruning and spacing.<br>
        - Use resistant varieties like FHIA-17 or Yangambi KM5 where available.
      `;
          break;

        case "banana yellow sigatoka disease":
          this.treatmentMessage = `
        <strong>Best Treatment for Yellow Sigatoka:</strong><br>
        - Use resistant cultivars and maintain field hygiene.<br>
        - Apply fungicides such as chlorothalonil or copper-based sprays during early infection.<br>
        - Remove lower infected leaves and avoid overhead irrigation.<br>
        - Monitor leaf spot progression and adjust spray intervals accordingly.
      `;
          break;

        default:
          this.treatmentMessage = null;
      }
    }
    ,
  },
};
</script>




<style scoped>
.upload-box {
  width: 300px;
  height: 300px;
  border: 2px solid #28a745;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #f8f9fa;
  margin: 0 auto;
  transition: background-color 0.3s ease;
}


.upload-box:hover {
  background-color: #e9f7ef;
}

.upload-text {
  font-size: 18px;
  color: #28a745;
  font-weight: 600;
  text-align: center;
}
</style>
