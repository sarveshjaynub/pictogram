module.exports = {
  mode: 'spa',
  head: {
    rel: 'stylesheet', 
    href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href:'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500&family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;1,200;1,300;1,400;1,600&display=swap'}
    ]
  },
  loading: {
    color: '#fff'
  },
  css: [],
  plugins: [
    
    { src: '~/plugins/socket.client.js' },
    { src: '~/plugins/vue-masonry', ssr: false }
  ],
  buildModules: [],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'vue-sweetalert2/nuxt'
  ],
  build: {
    extend(config, ctx) {}
  },
  axios: {
    baseURL: 'http://localhost:3000/api'
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/v1/login', method: 'post',  propertyName: 'token' },
          user: { url: '/v1/profile', method: 'get', propertyName: 'user' },
          logout: { url: '/v1/logout', method: 'post' },
          upload: { url: '/v1/upload', method: 'post', propertyName: false  },
          // tokenRequired: false,
          // tokenType: false
        }
      }
    }
  }
}
