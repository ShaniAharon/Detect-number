<template>
  <div id="app">
    <!-- <selfie @picture-taken="setImage" /> -->
    <selfie />
    <!-- <img :src="imgSrc" alt="" /> -->
  </div>
</template>

<script>
  import imgUpload from '@/cmps/img-upload.vue'
  import Register from '@/views/Register.vue'
  import selfie from '@/cmps/selfie.vue'
  export default {
    data() {
      return {
        imgUrls: [],
        imgSrc: null,
      }
    },
    methods: {
      saveImg(imgUrl) {
        this.imgUrls.push(imgUrl)
      },
      setImage(imgUrl) {
        this.imgSrc = imgUrl
      },
    },
    components: {
      imgUpload,
      Register,
      selfie,
    },
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
