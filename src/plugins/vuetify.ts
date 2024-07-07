/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import colors from 'vuetify/util/colors'


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
         // background: colors.grey.darken4,
         // primary: 'rgb(23,51,12)'
          'drop-highlight': colors.green.darken1
        }
      },
      light: {
        dark: false,
        colors: {
         // primary: colors.indigo.base,
         // background: colors.indigo.lighten4,
         // secondary: colors.indigo.accent3
          'drop-highlight': colors.green.lighten1
        }
      }
    }
  }
})
