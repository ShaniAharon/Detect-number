<template>
  <div class="conatiner-view">
    <section class="video-container">
      <video ref="video" style="height: 300px" @canplay="initCanvas()">
        Stream unavailable
      </video>
      <div class="detect-box"></div>
    </section>
    <button class="btn-pic" @click="takePicture()">Take Picture</button>
    <canvas ref="canvas" style="display: none"></canvas>
    <section v-if="dataExtracted" class="text-data">
      <!-- <pre>{{ dataExtracted }}</pre> -->
      <div class="data-preview">
        <h1>Voucher: {{ dataExtracted.voucherNum }}</h1>
        <h1>Bank: {{ dataExtracted.bank }}</h1>
        <h1>Account: {{ dataExtracted.account }}</h1>
      </div>
    </section>
  </div>
  <!-- find a place for the img later -->
  <img class="after-img" :src="imgSrc" alt="" />
</template>
<script>
  import {tesseractService} from '@/services/tesseract.service.js'
  import {uploadImg} from '@/services/img-upload.service.js'

  export default {
    name: 'selfie',
    mounted() {
      this.canvas = this.$refs.canvas
      this.video = this.$refs.video
      this.startCapture()
    },
    data() {
      return {
        video: null,
        canvas: null,
        imgSrc: null,
        dataExtracted: null,
      }
    },
    methods: {
      startCapture() {
        navigator.mediaDevices
          .getUserMedia({video: true, audio: false})
          .then((stream) => {
            this.video.srcObject = stream
            this.video.play()
          })
          .catch((error) => {
            console.log(error)
          })
      },
      async dataUrlToFile(dataUrl, fileName) {
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        return new File([blob], fileName, {type: 'image/png'})
      },
      async takePicture() {
        let ctx = this.canvas.getContext('2d')
        //try to catch only the box
        ctx.drawImage(
          this.video,
          0,
          0,
          this.video.videoWidth,
          this.video.videoHeight
        )
        this.imgSrc = this.canvas.toDataURL('image/png')
        const imgFile = await this.dataUrlToFile(this.imgSrc, 'test')
        const res = await uploadImg(imgFile)
        const imageRes = await tesseractService.save({imgUrl: res.url})
        console.log('imageResualt', imageRes)
        this.prepareData(imageRes)
        // this.$emit('picture-taken', this.canvas.toDataURL('image/png'))
      },
      initCanvas() {
        this.canvas.setAttribute('width', this.video.videoWidth)
        this.canvas.setAttribute('height', this.video.videoHeight)
      },
      prepareData(txt) {
        //need to capture only the number we need not all the pic
        //try object detect maybe
        txt =
          '' +
          txt
            .split('')
            .filter((t) => t !== '\n' && t !== '\r' && t !== ' ')
            .join('')

        const data = {voucherNum: '', bank: '', account: ''}
        data.voucherNum = txt.substring(3, 14)
        data.bank = txt.substring(14, 22)
        data.account = txt.substring(22, 32)

        console.log(txt, 'txt')
        console.log(data, 'data')
        this.dataExtracted = data
      },
    },
  }
</script>

<style lang="scss" scoped></style>
