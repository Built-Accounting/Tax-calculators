<template>
  <v-app>
    <v-main class="bg-grey-lighten-3 pb-5">
      <v-container class="pt-5">

        <v-btn v-if="false" @click="$vuetify.theme.isDark=!$vuetify.theme.isDark" class="mr-4 mt-4" position="fixed" right top icon="mdi-lightbulb"></v-btn>

        <router-view/>
      </v-container>
    </v-main>
    <v-footer class="d-flex flex-column w-100 bg-transparent mt-5" bottom position="absolute">
      <div class="d-flex w-100 px-4 text-center bg-black">

        <center>

        </center>

      </div>

      <div class="px-4 py-2 text-grey text-center w-100">


        <v-btn
            target="_blank"
            variant="plain"
            size="small"
            href="https://builtaccounting.com"
        >
          {{ new Date().getFullYear() }} — <strong>Built Finance Technologies</strong>
        </v-btn>

        <v-btn
            target="_blank"

            icon="mdi-facebook"
            variant="plain"
            size="small"
            href="https://web.facebook.com/builtaccounting"
        ></v-btn>
        <v-btn
            target="_blank"

            icon="mdi-twitter"
            variant="plain"
            size="small"
            href="https://twitter.com/builtaccounting"
        ></v-btn>

        <v-btn
            target="_blank"

            icon="mdi-linkedin"
            variant="plain"
            size="small"
            href="https://www.linkedin.com/company/built-accounting/mycompany/"
        ></v-btn>

      </div>
    </v-footer>

  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  mounted() {
    console.log(this.$vuetify.theme.isDark)
  }
}
</script>
