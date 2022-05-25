<template>
  <div class="photo-capture" v-show="enableCamera">
    <div v-if="pickImage">
      <h2>Upload a clear Photo</h2>
      <input type="file" accept="image/*" id="image-picker" @change="upload" />

      <div class="upload-actions">
        <button type="button" class="btn-capture" @click.prevent="done">
          <i class="fas fa-thumbs-up"></i>
        </button>
      </div>
    </div>

    <div v-else class="video-container">
      <video
        v-show="showVideo"
        ref="player"
        class="camera"
        autoplay
        playsinline
      ></video>
      <canvas v-show="!showVideo" class="preview" ref="canvas"></canvas>

      <div class="center photo-capture-actions">
        <button
          type="button"
          class="btn-capture"
          @click.prevent="capture"
          v-if="showVideo"
        >
          <i class="fas fa-camera"></i>
        </button>
        <div v-else>
          <button type="button" class="btn-capture" @click.prevent="cancel">
            <i class="fas fa-undo-alt"></i>
          </button>
          <button type="button" class="btn-capture" @click.prevent="done">
            <i class="fas fa-thumbs-up"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const EVENTS = {
    ON_DONE: 'done',
    ON_CLEAR: 'clear',
  }
  import {tesseractService} from '@/services/tesseract.service.js'
  import {uploadImg} from '@/services/img-upload.service.js'

  export default {
    props: {
      enableCamera: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        showVideo: true,
        pickImage: false,
        picture: null,
      }
    },
    mounted() {
      this.videoPlayer = this.$refs.player
      this.canvasElement = this.$refs.canvas
      this.streamUserMediaVideo()
    },
    computed: {},
    methods: {
      streamUserMediaVideo() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          this.pickImage = true
          return
        }

        navigator.mediaDevices
          .getUserMedia({video: true})
          .then((stream) => (this.videoPlayer.srcObject = stream))
          .catch((err) => {
            this.pickImage = true
            console.error('could not open the camera', err)
          })
      },
      capture() {
        this.showVideo = false
        this.canvasElement.width = this.videoPlayer.videoWidth
        this.canvasElement.height = this.videoPlayer.videoHeight

        var context = this.canvasElement.getContext('2d')
        context.translate(this.canvasElement.width, 0)
        context.scale(-1, 1) // transform horizintal soo the text will not be backwords

        context.drawImage(this.$refs.player, 0, 0)

        this.stopVideoStream()
        this.picture = this.$refs.canvas.toDataURL('image/png')
        this.showVideo = false
      },
      upload(ev) {
        var reader = new FileReader()

        reader.onload = (event) => (this.picture = event.target.result)

        reader.readAsDataURL(ev.target.files[0])
      },
      async dataUrlToFile(dataUrl, fileName) {
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        return new File([blob], fileName, {type: 'image/png'})
      },
      async done() {
        console.log(this.picture)
        const imgFile = await this.dataUrlToFile(this.picture, 'test')
        const res = await uploadImg(imgFile)
        const imageRes = await tesseractService.save({imgUrl: res.url})
        console.log('the data', imageRes)
        // const file = await tesseractService.sendFile(imgFile)
        console.log('res', res.url)
        this.$emit(EVENTS.ON_DONE, this.picture)
      },

      cancel() {
        this.showVideo = true
        this.streamUserMediaVideo()
        this.$emit(EVENTS.ON_CLEAR)
      },
      stopVideoStream() {
        if (!(this.$refs.player && this.$refs.player.srcObject)) return
        this.$refs.player.srcObject.getVideoTracks().forEach((track) => {
          track.stop()
        })
      },
    },
    unmounted() {
      this.stopVideoStream()
    },
  }
</script>

<style lang="scss" scoped>
  .photo-capture {
    .upload-actions {
      display: flex;
      justify-content: flex-end;
      padding: 10px 5px;
    }

    .video-container {
      text-align: center;

      .camera,
      .preview {
        // width: 100%;
        // height: 202px;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        object-fit: cover;
        margin-top: 10px;
      }

      .camera {
        transform: scaleX(-1);
        filter: FlipH;
      }

      .photo-capture-actions {
        margin: 27px 0 0 0;

        button {
          &:not(:last-child) {
            margin-right: 20px;
          }
        }
      }
    }
  }
</style>
