<template>
  <div
    class="leading-normal tracking-normal text-white background"
    style="font-family: 'Source Sans Pro', sans-serif"
  >
    <Header />
    <Section id="make" title="只今メンテナンス中です">
      <div class="flex flex-wrap">
        <div class="w-full sm:w-1/2 p-6 mx-auto">
          <h3
            class="md:text-3xl text-lg text-gray-800 font-bold leading-none mb-3"
          >
            {{ $t("ご迷惑をおかけしてすみません。") }}
          </h3>
          <p class="text-gray-600 mb-3 text-base">
            {{ $t("できるだけ早く復旧するようにがんばります。") }}
          </p>
        </div>
        <div class="w-full mt-3 sm:w-1/2 relative">
          <img
            v-if="!uploadImageUrl"
            src="../assets/img/sorry.jpg"
            alt="default"
            class="border-double border-4 border-gray-600"
          />
          <img
            v-if="uploadImageUrl"
            class="border-double border-4 border-gray-600"
            width="100%"
            :src="uploadImageUrl"
          />
        </div>
      </div>
    </Section>
    <Section title="画像のスタイルを選ぶ">
      <p
        class="w-full text-center mt-3 text-gray-600 text-2xl mb-3"
        v-if="!uploadImageUrl && !changedImageUrl"
      >
        {{ $t("先に画像を選択してください") }}
      </p>
      <div
        v-for="art in arts"
        :key="art.id"
        class="lg:w-1/6 md:w-1/3 w-1/2 p-1 flex flex-col cursor-pointer"
        :class="{
          'opacity-50 pointer-events-none': !uploadImageUrl || overlay,
        }"
      >
        <div
          class="overflow-hidden rounded-lg shadow-lg transform transition hover:scale-105 duration-300 ease-in-out"
          @click="getArt(art[1])"
        >
          <img
            :src="art[0]"
            class="imageClass block w-full h-auto object-cover"
            alt="art"
          />
        </div>
      </div>
    </Section>
    <Section title="画像をシェア/保存">
      <p
        v-if="!uploadImageUrl && !changedImageUrl && !overlay"
        class="w-full text-center mt-3 text-gray-600 text-2xl mb-3"
      >
        {{ $t("先に絵画を作成してください") }}
      </p>
      <div class="w-full mx-auto">
        <Loaging v-if="overlay" />
      </div>

      <div v-if="changedImageUrl" class="w-full sm:w-1/2 p-6 mx-auto">
        <h3
          class="md:text-3xl text-lg text-gray-800 font-bold leading-none mb-3"
        >
          {{ $t("絵画が作成されました！") }}
        </h3>
        <p class="text-gray-600 mb-3 text-base">
          {{ $t("シェアや保存などしてお楽しみください。") }}
        </p>
        <ul class="flex space-x-6 mx-auto">
          <li>
            <div @click="OpenTwitterModal" class="cursor-pointer">
              <img
                alt="twitter"
                src="../assets/img/twitter.svg"
                :width="size"
                :height="size"
              />
            </div>
          </li>
          <li>
            <div @click="OpenFBModal" class="cursor-pointer">
              <img
                alt="twitter"
                src="../assets/img/facebook.svg"
                :width="size"
                :height="size"
              />
            </div>
          </li>
          <li>
            <a :href="changedImageUrl" download>
              <img
                alt="line"
                src="../assets/img/download.svg"
                :width="size"
                :height="size"
              />
            </a>
          </li>
        </ul>
      </div>
      <div class="w-full mt-3 sm:w-1/2 relative">
        <img
          v-if="changedImageUrl"
          class="border-double border-4 border-gray-600"
          :src="changedImageUrl"
          width="100%"
        />
      </div>
    </Section>
    <Footer />
  </div>
</template>

<script>
import getArtImage from "~/assets/lib/getArt";
import postImageData from "~/assets/lib/postImageData";
import resizeImage from "~/assets/lib/resizeImage";
import Modal from "~/components/Modal.vue";
import Header from "~/components/Header.vue";
import Footer from "~/components/Footer.vue";
import Section from "~/components/Section.vue";
import Loaging from "~/components/Loaging.vue";
import Wave from "~/assets/img/wave.jpeg";
import Muse from "~/assets/img/la_muse.jpeg";
import Rain from "~/assets/img/rain_princess.jpeg";
import Scream from "~/assets/img/the_scream.jpeg";
import Wreck from "~/assets/img/the_shipwreck_of_the_minotaur.jpeg";
import Udnie from "~/assets/img/udnie.jpeg";
export default {
  asyncData({ app }) {
    const locale = app.$cookies.get("locale");
    return {
      defaultLang: locale,
    };
  },
  components: {
    Modal,
    Header,
    Footer,
    Section,
    Loaging,
  },
  data() {
    return {
      changedImageUrl: "",
      uploadImageUrl: "",
      overlay: false,
      base64: "",
      uuid: "",
      twitterModalFlag: false,
      FBModalFlag: false,
      imageData: "",
      isFetched: false,
      tooBig: false,
      arts: [
        [Wave, 0],
        [Scream, 1],
        [Muse, 2],
        [Rain, 3],
        [Udnie, 4],
        [Wreck, 5],
      ],
    };
  },
  computed: {
    size() {
      return 54;
    },
    url() {
      return `https://art-creator.net/art/${this.uuid}`;
    },
    twitterURL() {
      const shareText = this.$t("絵画ツクールで素敵な絵画を作ったよ");
      const hash = this.$t("#絵画ツクール");
      return (
        `https://twitter.com/intent/tweet?url=${this.url}&text=` +
        encodeURIComponent(shareText + `\r\n` + hash)
      );
    },
    facebookURL() {
      const shareText = this.$t("絵画ツクールで素敵な絵画を作ったよ");
      const hash = this.$t("#絵画ツクール");
      return `https://www.facebook.com/sharer/sharer.php?u=${this.url}&t=${shareText}\n${hash}`;
    },
  },
  mounted() {
    if (this.defaultLang) {
      return;
    }
    const userLanguage = navigator.language;
    const setLang = userLanguage === "ja" ? "ja" : "en";
    this.$cookies.set("locale", setLang);
    this.$i18n.locale = setLang;
  },
  methods: {
    tweetButton() {
      if (this.isFetched) {
        window.open(this.twitterURL, "_blank");
      }
    },
    FBButton() {
      if (this.isFetched) {
        window.open(this.facebookURL, "_blank");
      }
    },
    async OpenTwitterModal() {
      this.twitterModalFlag = true;
      this.uuid = this.generateUuid();
      await postImageData(this.uuid, this.imageData).then(() => {
        this.isFetched = true;
        window.history.pushState(null, null, `/art/${this.uuid}`);
      });
    },
    async OpenFBModal() {
      this.FBModalFlag = true;
      this.uuid = this.generateUuid();
      await postImageData(this.uuid, this.imageData).then(() => {
        this.isFetched = true;
        window.history.pushState(null, null, `/art/${this.uuid}`);
      });
    },
    CloseModal() {
      this.twitterModalFlag = false;
      this.FBModalFlag = false;
      this.isFetched = false;
      window.history.pushState(null, null, "/");
    },
    checkImageSize(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        if (file.size > 40 * 1000 * 1000) {
          this.tooBig = true;
          return;
        }
        this.tooBig = false;
        reader.onload = (e) => {
          this.uploadImageUrl = reader.result;
          const image = new Image();
          image.src = e.target.result;
          image.onload = () => {
            resolve(image);
          };
        };
        reader.readAsDataURL(file);
      });
    },
    async setImage(e) {
      const [file] = e.target.files;
      const image = await this.checkImageSize(file);
      if (image) {
        this.base64 = await resizeImage(image, 800, 800);
      }
      if (this.$refs.fileInput.value) {
        this.$refs.fileInput.value = "";
      }
    },
    getArt(number) {
      if (this.base64) {
        this.getResult(this.base64, number);
      }
    },
    generateUuid() {
      let chars = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".split("");
      for (let i = 0, len = chars.length; i < len; i++) {
        switch (chars[i]) {
          case "x":
            chars[i] = Math.floor(Math.random() * 16).toString(16);
            break;
          case "y":
            chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
            break;
        }
      }
      return chars.join("");
    },
    async getResult(file, style) {
      this.overlay = true;
      const res = await getArtImage(file, style);
      if (res.status === "NG") {
        alert(
          this.$t(
            "サーバーエラーが発生しました。しばらく経ってから再度お試しください。"
          )
        )
          ? ""
          : window.location.reload();
        console.error(res.status_message);
        return;
      }
      this.imageData = res.result_img;
      this.changedImageUrl = "data:image/png;base64," + this.imageData;
      this.overlay = false;
    },
  },
};
</script>
<style>
.gradient {
  background: linear-gradient(90deg, #38382e 0%, #d97707 100%);
}
.background {
  background-image: url("~/assets/img/background.png");
  background-repeat: repeat;
  background-size: 768px 432px;
}

.imageClass {
  height: 200px;
}
.modalImageClass {
  max-height: 350px;
}
</style>
