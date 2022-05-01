<template>
  <span>
    <v-row>
      <v-col cols="12" sm="6" class="mx-auto mt-5">
        <v-row>
          <v-col cols="12" sm="6">
            <v-card flat tile>
              <center>
                <v-icon color="blue" style="font-size: 70px"
                  >mdi-account-multiple-check-outline</v-icon
                >
              </center>

              <v-card-text class="text-center">
                <h2>Gross-to-net Calculator</h2>
                <p class="mt-3">
                  Get the breakdown of earnings and deductions of your employees
                  for multiple countries.
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  to="/gross-to-net"
                  block
                  color="info"
                  theme="dark"
                  class="text-white"
                  style="color: white"
                  variant="contained"
                  filled
                  depressed
                  large
                  rounded
                >
                  Use calculator
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card flat tile>
              <center>
                <v-icon color="blue" style="font-size: 70px"
                  >mdi-scale-balance</v-icon
                >
              </center>

              <v-card-text class="text-center">
                <h2>VAT Calculator</h2>
                <p class="mt-3">
                  Calculate hom much tax you would pay by providing an amount
                  for multiple countries.
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  block
                  color="info"
                  variant="contained"
                  filled
                  depressed
                  large
                  rounded
                  to="/vat"
                >
                  Use calculator
                  <v-icon>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </span>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
});
</script>
