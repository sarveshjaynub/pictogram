<template>
  <div class="background">
    <div class="elementor-background-video-container elementor-hidden-phone">
      <video autoplay muted loop id="myVideo">
        <source src="~/assets/133_blue_bokeh.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="pictogram-background-overlay"></div>

    <div class="pictogram-header">
      <nav class="navbar navbar-lg navbar-expand-lg">
        <h1 id="logo-pro" class="nav-logo">
          <a
            href="https://vayvo.progressionstudios.com/"
            class="nav-brand"
            title="Vayvo"
            rel="home"
          >Pictogram</a>
        </h1>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto"></ul>
          <form class="form-inline my-2 ml-5 mr-3">
            <b-button
              variant="btn-outline-light my-2 my-sm-0 btn-login"
              v-if="!isAuthenticated"
              @click="openLoginDialog()"
            >Sign in</b-button>

            <b-button
              variant="btn-outline-light my-2 my-sm-0 btn-login"
              v-if="isAuthenticated"
              @click="applyImageFilter()"
            >Images</b-button>
            <b-button
              variant="btn-outline-light my-2 my-sm-0 btn-login ml-2"
              v-if="isAuthenticated"
              @click="applyVideoFilter()"
            >Videos</b-button>
            <b-button
              variant="btn-outline-light my-2 my-sm-0 btn-login ml-2"
              v-if="isAuthenticated"
              @click="applyMyFileFilter()"
            >My Files</b-button>
            <b-button
              variant="btn-outline-light my-2 my-sm-0 btn-login ml-3"
              v-if="isAuthenticated"
              @click="openUploadDialog()"
            >Upload Image/Video</b-button>
            <b-button
              variant="btn-outline-light my-2 my-sm-0 btn-login ml-2"
              v-if="isAuthenticated"
              @click="openlogoutDialog()"
            >Logout</b-button>
          </form>
        </div>

        <b-modal id="registerModal" title="Register Here" hide-footer v-model="registerDialog" persistent>
          <div class="container">
            <div class="row">
              <div class="col-sm-12">
                <div class="account-wall">
                  <img
                    class="profile-img"
                    src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                  />
                  <form class="form-signin" method="post" @submit.prevent="register">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="firstname"
                      v-model="firstname"
                      required
                      autofocus
                    />
                    <input
                      type="text"
                      class="form-control"
                      placeholder="lastname"
                      v-model="lastname"
                      required
                      autofocus
                    />
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Email"
                      v-model="email"
                      required
                      autofocus
                    />
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      v-model="password"
                      required
                    />
                    <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </b-modal>

        <b-modal id="loginModal" title="Please Sign In" hide-footer v-model="loginDialog" persistent>
          <div class="container">
            <div class="row">
              <div class="col-sm-12">
                <div class="account-wall">
                  <img
                    class="profile-img"
                    src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                  />
                  <form class="form-signin" method="post" @submit.prevent="login">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Email"
                      v-model="email"
                      required
                      autofocus
                    />
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      v-model="password"
                      required
                    />
                    <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>

                    <div style="margin-top:10px;">
                      <b-button
                        variant="btn-outline-light btn-link text-center new-account"
                        @click="closeLoginDialogOpenRegisterDialog()"
                      >Create an account</b-button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </b-modal>

        <b-modal id="logoutModal" title="Log Out" hide-footer v-model="logoutDialog" @keydown.esc="cancel" persistent>
          <div class="container">
            <div class="row">
              <div class="col-sm-12">
                <div class="account-wall">
                  <b-card>
                    <b-card-text>Would you like to logout?</b-card-text>

                    <b-button href="#" variant="primary" @click.native="logout">Yes</b-button>
                    <b-button href="#" variant="primary" @click.native="cancel">Cancel</b-button>
                  </b-card>
                </div>
              </div>
            </div>
          </div>
        </b-modal>

        <b-modal id="uploadModal" title="Upload File" hide-footer v-model="uploadDialog" persistent>
          <div class="container">
            <div class="large-12 medium-12 small-12 cell">
              <label>
                Files
                <input
                  type="file"
                  id="files"
                  ref="files"
                  v-on:change="handleFilesUpload()"
                  style="visibility: hidden"
                />
              </label>
            </div>

            <div class="large-12 medium-12 small-12 cell">
              <button v-on:click="addFiles()">Add Files</button>
            </div>

            <br />

            <div class="large-12 medium-12 small-12 cell">
              <div v-for="(file, key) in files" :key="key" class="file-listing">
                {{ file.name }}
                <span class="remove-file" v-on:click="removeFile( key )">Remove</span>
              </div>
            </div>

            <br />

            <div class="large-12 medium-12 small-12 cell">
              <button class="btn btn-lg btn-primary btn-block" v-on:click="uploadFiles()">Upload!</button>
            </div>
          </div>
        </b-modal>
      </nav>
    </div>

    <div class="pictogram-container">
      <div class="container-">
        <no-ssr>
          <!-- Show All -->
          <div v-masonry transition-duration="0.3s" item-selector=".item" class="masonry-container">
            <div v-masonry-tile v-if="!isAuthenticated">
              <div style="display: table; height:80vh">
                <div style="display: table-cell; vertical-align: middle">
                  <div class="center">
                    <h1 class="video-page-title">
                      Shared Photos and Videos Streaming.
                    </h1>  
                      <br /><h2>Start Your Free Trial</h2>
                      <br /><p>Sign in To Continue</p> 
                  </div>
                </div>
              </div>
            </div>

            <div
              v-masonry-tile
              class="item"
              v-for="(i, index) in images"
              :key="i.name"
              v-if="isAuthenticated && allFilters"
            >
              <div class="grid-item">
                <div class="card img-hover-zoom" style="width: 18rem;">
                  <img
                    class="card-img-top image"
                    :src="'/uploads/'+i.name"
                    v-if="i.type!='video/mp4'"
                  />
                  <video class="card-img-top image" v-if="i.type=='video/mp4'">
                    <source :src="'/uploads/'+i.name" type="video/mp4" />
                  </video>

                  <div class="middle" v-if="isAuthenticated && loggedInUser.data.id==i.uploaded_by">
                    <div class="text" @click="deleteImage(index, i.id)">Delete</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Group By Images -->
            <div
              v-masonry-tile
              class="item"
              v-for="(i, index) in images"
              :key="i.name"
              v-if="imagesFilters && i.type!='video/mp4'"
            >
              <div class="grid-item">
                <div class="card img-hover-zoom" style="width: 18rem;">
                  <img
                    class="card-img-top image"
                    :src="'/uploads/'+i.name"
                    v-if="i.type!='video/mp4'"
                  />

                  <div class="middle" v-if="isAuthenticated && loggedInUser.data.id==i.uploaded_by">
                    <div class="text" @click="deleteImage(index, i.id)">Delete</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Group By Videos -->
            <div
              v-masonry-tile
              class="item"
              v-for="(i, index) in images"
              :key="i.name"
              v-if="isAuthenticated && videoFilters && i.type=='video/mp4'"
            >
              <div class="grid-item">
                <div class="card img-hover-zoom" style="width: 18rem;">
                  <video class="card-img-top image" v-if="i.type=='video/mp4'">
                    <source :src="'/uploads/'+i.name" type="video/mp4" />
                  </video>

                  <div class="middle" v-if="isAuthenticated && loggedInUser.data.id==i.uploaded_by">
                    <!-- <div class="text" @click="deleteImage(index, i.id)">Delete</div> -->
                  </div>
                </div>
              </div>
            </div>

            <!-- Group By My Uploads -->
            <div
              v-masonry-tile
              class="item"
              v-for="(i, index) in images"
              :key="i.name"
              v-if="isAuthenticated && myFiles && loggedInUser && loggedInUser.data.id==i.uploaded_by"
            >
              <div class="grid-item">
                <div class="card img-hover-zoom" style="width: 18rem;">
                  <img
                    class="card-img-top image"
                    :src="'/uploads/'+i.name"
                    v-if="i.type!='video/mp4'"
                  />
                  <video class="card-img-top image" v-if="i.type=='video/mp4'">
                    <source :src="'/uploads/'+i.name" type="video/mp4" />
                  </video>

                  <div class="middle" v-if="loggedInUser.data.id==i.uploaded_by">
                    <div class="text" @click="deleteImage(index, i.id)">Delete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </no-ssr>
      </div>
    </div>
  </div>
</template>

<script>
import { BModal, VBModal } from "bootstrap-vue";
import { mapState, mapGetters } from "vuex";
import NoSSR from "vue-no-ssr";
import "@sweetalert2/themes/wordpress-admin/wordpress-admin.css";

const jwt = require('jsonwebtoken')

export default {
  components: {
    "no-ssr": NoSSR,
    BModal
  },
  directives: { "b-modal": VBModal },
  mounted() {
  },
  data() {
    return {
      firstname: "keshav",
      lastname: "murachpersad",
      email: "sm@email.com",
      password: "1234",
      error: null,
      files: [],
      loginDialog: false,
      registerDialog: false,
      uploadDialog: false,
      logoutDialog: false,
      images: [],
      allFilters: true,
      imagesFilters: false,
      videoFilters: false,
      myFiles: false
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"])
  },
  mounted() {
    var this_ = this;

    this.$axios
      .get("/v1/loadImages")
      .then(response => {
        this_.images = response.data;
      })
      .catch(err => {});
  },
  methods: {
    deleteImage(index, imageId) {
      var this_ = this;

      var data = {
        imagesToDelete: [imageId]
      };

      this_
        .$swal({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.$axios
              .post("/v1/deleteImages", data)
              .then(response => {
                this_.images.splice(index, 1);
                this_.$swal(
                  "Deleted!",
                  "The File has been deleted.",
                  "success"
                );
              })
              .catch(err => {
                this_.$swal("Failed!", "Fail to delete image.", "error");
              });
          }
        });
    },
    applyImageFilter() {
      this.allFilters = false;
      this.imagesFilters = true;
      this.videoFilters = false;
      this.myFiles = false;
    },
    applyVideoFilter() {
      this.allFilters = false;
      this.imagesFilters = false;
      this.videoFilters = true;
      this.myFiles = false;
    },
    applyMyFileFilter() {
      this.allFilters = false;
      this.imagesFilters = false;
      this.videoFilters = false;
      this.myFiles = true;
    },
    closeLoginDialogOpenRegisterDialog: function() {
      this.loginDialog = false;
      this.registerDialog = true;
    },
    openLoginDialog: function() {
      this.loginDialog = true;
    },
    openUploadDialog: function() {
      this.uploadDialog = true;
    },
    openlogoutDialog: function() {
      this.logoutDialog = true;
    },
    async logout() {
      this.logoutDialog = false;
      await this.$auth.logout();
      this.$router.push("/");
    },
    async login() {
      var this_ = this;

      await this_.$auth
        .loginWith("local", {
          data: {
            email: this_.email,
            password: this_.password
          }
        })
        .then(async function(response) {
          var decoded = jwt.verify(response.data.token, 'dummy');

          this_.$auth.setUser(decoded);

          this_.loginDialog = false;
          this_.registerDialog = false;
          this_.$router.push("/");
        });
    },
    cancel() {
      this.logoutDialog = false;
    },
    async register() {
      var this_ = this;

      try {
        await this.$axios
          .post("/v1/register", {
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            password: this.password
          })
          .then(async function(response) {
            await this_.$auth
              .loginWith("local", {
                data: {
                  email: this_.email,
                  password: this_.password
                }
              })
              .then(async function(loginResponse) {
                this_.loginDialog = false;
                this_.registerDialog = false;
                this_.$router.push("/");

                this_.$swal(
                  "You are in!",
                  "Registration Successfull",
                  "success"
                );
              });
          })
          .catch(function(error) {
            this_.$swal("Conflict!", error.response.data.message, "success");
          });
      } catch (e) {
        console.error(e);
      }
    },
    addFiles() {
      this.$refs.files.click();
    },
    uploadFiles() {
      let this_ = this;
      let formData = new FormData();

      for (var i = 0; i < this.files.length; i++) {
        let file = this.files[i];

        formData.append("file", file);
        formData.append("description", "This is an image.");
        formData.append("uploaded_by", this.loggedInUser.data.id);
      }

      this.$axios
        .post("/v1/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(function() {
          this_.$swal("Uploaded!", "Your file has been uploaded.", "success");
          location.reload();
        })
        .catch(function(err) {
          this_.$swal(
            "Upload Failed!",
            "Your file could not be uploaded. Please try again.",
            "error"
          );
        });

      this_.uploadDialog = false;
    },
    handleFilesUpload() {
      let uploadedFiles = this.$refs.files.files;

      for (var i = 0; i < uploadedFiles.length; i++) {
        this.files.push(uploadedFiles[i]);
      }
    },
    removeFile(key) {
      this.files.splice(key, 1);
    }
  }
};
</script>

<style scoped>
#myVideo {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
}

.pictogram-background-overlay {
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background-color: transparent;
  background-image: linear-gradient(
    180deg,
    rgba(8, 7, 14, 0.7) 0%,
    #08070e 100%
  );
  opacity: 1;
  transition: background 0.3s, border-radius 0.3s, opacity 0.3s;
}

.pictogram-header {
  position: fixed;
  top: 0;
}

.pictogram-header,
.pictogram-container {
  background: rgba(0, 0, 0, 0.5);
  color: #f1f1f1;
  width: 100%;
}

.pictogram-container {
  margin-top: 70px;
  outline: 1px solid red;
}

.navbar {
  border-bottom: 1px solid rgba(236, 239, 241, 0.12);
}

.nav-logo {
  margin: unset;
}

.nav-logo a {
  border-right: 1px solid rgba(236, 239, 241, 0.12);
  font-family: "Dancing Script";
  padding-right: 20px;
  padding-left: 20px;
  color: rgba(236, 239, 241, 0.7);
  font-size: 1.1em;
}

.btn-login {
  border-radius: 50px !important;
  font-family: "Source Sans Pro", sans-serif;
  border-color: rgba(236, 239, 241, 0.7);
  color: rgba(236, 239, 241, 0.7);
  font-weight: 300;
}

.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  font-size: 16px;
  height: auto;
  padding: 10px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.account-wall {
  padding: 40px 0px 20px 0px;
}
.login-title {
  color: #555;
  font-size: 18px;
  font-weight: 400;
  display: block;
}
.profile-img {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
.new-account {
  display: block;
  text-align: center !important;
  width: 100%;
  font-family: "Roboto";
}

a,
h1,
h2,
h3,
h4,
h5,
h6,
p,
label,
button {
  font-family: "Roboto";
}

.form-control::-webkit-input-placeholder {
  /* Edge */
  font-family: "Roboto";
}

.form-control:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  font-family: "Roboto";
}

.form-control::placeholder {
  font-family: "Roboto";
}

div.file-listing {
  width: 200px;
}

span.remove-file {
  color: red;
  cursor: pointer;
  float: right;
}

.image {
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: 0.5s ease;
  backface-visibility: hidden;
}

.middle {
  transition: 0.5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.img-hover-zoom:hover .image {
  opacity: 0.3;
}

.img-hover-zoom:hover .middle {
  opacity: 1;
}

.text {
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  padding: 16px 32px;
}

.center {
  margin: auto;
  width: 60%;
  border: 3px solid;
  color: rgba(236, 239, 241, 0.7);
  padding: 10px;
}

h1.video-page-title {
  font-size: 70px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.1;
  position: center;
}

</style>