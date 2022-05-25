<template>
  <div class="register-container">
    <div class="register-title">register</div>
    <form @submit.prevent="register" class="form-register">
      <div class="capture-container" :class="{show: isCameraVisible}">
        <photo-capture
          v-if="isCameraVisible"
          @done="capturePhoto"
        ></photo-capture>
      </div>

      <div class="img-container">
        <div
          class="img-preview"
          :style="{'background-image': `url(${imgData})`}"
          @click="showCamera"
        >
          <i v-if="!isProcessing" class="fas fa-camera btn-set-photo"></i>
          <i v-else class="fas fa-check btn-set-photo"></i>
          <div v-if="isProcessing" class="background verify-image"></div>
        </div>
      </div>
      <div v-if="user.imgData">
        <img :src="user.imgData" alt="" />
      </div>
      <div class="field">
        <label class="field-icon">
          <i class="fas fa-user"></i>
        </label>
        <input
          type="text"
          class="field-input"
          v-model="user.name"
          placeholder="Name *"
        />
      </div>

      <div class="field">
        <label class="field-icon">
          <i class="fas fa-envelope"></i>
        </label>
        <input
          type="email"
          class="field-input"
          v-model="user.email"
          placeholder="Email *"
        />
      </div>

      <div class="footer">
        <button
          :disabled="!isValid && isProcessing"
          type="submit"
          class="btn-identify"
        >
          Verify Identity
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import photoCapture from '../cmps/PhotoCapture.vue'
  import img from '@/assets/img/anonymous.png'

  export default {
    data() {
      return {
        isCameraVisible: false,
        isProcessing: false,
        user: {
          name: '',
          email: '',
          imgData: '',
        },
      }
    },
    computed: {
      imgData() {
        return this.user.imgData || img
      },
      isValid() {
        return this.user.name && this.user.email
      },
    },
    methods: {
      showCamera() {
        this.isCameraVisible = true
      },
      capturePhoto(imgData) {
        this.user.imgData = imgData
        this.isCameraVisible = false
      },
      async register() {
        if (this.user.name && this.user.email) {
          this.isProcessing = true
          try {
            await this.$store.dispatch({type: 'register', user: this.user})
            this.$router.push('/')
          } catch (err) {
            alert('You are the problem..')
            this.isProcessing = false
          }
        }
      },
    },
    components: {
      photoCapture,
    },
  }
</script>

<style lang="scss">
  /* @import '../assets/css/_variables.scss'; */

  .register-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    max-width: 320px;
    margin: 0 auto;
    padding: 20px;
    background-color: rgb(221, 221, 230);
    border-radius: 6px;

    .register-title {
      text-transform: uppercase;
      color: rebeccapurple;
    }

    .capture-container {
      position: absolute;
      z-index: 1;
      top: 15px;
      bottom: 0;
      left: 0;
      right: 0;

      background-color: #ffffff;
      transform: translateY(500px);
      transition: transform 0.3s;

      &.show {
        transform: translateY(0);
      }
    }
    .img-container {
      .img-preview {
        position: relative;
        margin: 1em auto;
        width: 160px;
        height: 160px;
        background-size: cover;
        background-position: center center;
        border: 1px solid #ffffff;
        border-radius: 50%;

        .btn-set-photo {
          position: absolute;
          bottom: -4px;
          right: 7px;
          font-size: 35px;
        }
      }

      .verify-image {
        z-index: 2;
        background-size: 20%;
        background-image: url('../assets/img/binary-back.png');
        animation: animatedBackground 5s linear forwards 1;
        background-position: 0px 0px;
        border-radius: 50%;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      @keyframes animatedBackground {
        from {
          background-position: 0 0;
          opacity: 1;
        }

        to {
          background-position: 100% 0;
          opacity: 0;
        }
      }
    }

    .form-register {
      width: 100%;
      overflow: hidden;
      position: relative;
      padding: 2px;
    }
  }
</style>
