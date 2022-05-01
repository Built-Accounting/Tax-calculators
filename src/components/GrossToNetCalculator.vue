<template>
  <span>

    <v-card-text>
      <v-row v-if="step == 1">
        <v-col cols="12" sm="4" class="mx-auto">
          <v-card flat="" rounded>
            <v-card-title class="mb-0 font-weight-light">
               <v-btn @click="$router.back()" variant="plain"
               ><v-icon>mdi-arrow-left</v-icon>Back</v-btn
               ><v-spacer></v-spacer>
Select a country
            </v-card-title>

              <v-list>
                <v-list-item  @click="step = country.step" class="border-b" v-for="country in countries" :key="country.code">
                  <v-list-item-avatar start>
                    <flag
                      style="width: 100px; height: 70px"
                      :iso="country.code"
                    ></flag>
                  </v-list-item-avatar>
                  <v-list-item-title>{{ country.name }}</v-list-item-title>
                  <v-spacer></v-spacer>
                  <v-list-item-icon end icon="mdi-chevron-right" class="text-grey">
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
          </v-card>
        </v-col>
        <!--              <v-col-->
        <!--                cols="12"-->
        <!--                sm="4"-->
        <!--                v-for="country in countries"-->
        <!--                :key="country.code"-->
        <!--              >-->
        <!--                <v-card-->
        <!--                  flat-->
        <!--                  class="text-center pa-5"-->
        <!--                  @click="step = country.step"-->
        <!--                >-->
        <!--                  <flag-->
        <!--                    style="width: 100px; height: 70px"-->
        <!--                    :iso="country.code"-->
        <!--                  ></flag>-->
        <!--                  <h2 class="font-weight-bold">{{ country.name }}</h2>-->
        <!--                  <small class="text-muted"-->
        <!--                    >Select to calculate gross-to-net in-->
        <!--                    {{ country.name }}</small-->
        <!--                  >-->
        <!--                </v-card>-->
        <!--              </v-col>-->
      </v-row>

      <ghana-payroll v-if="step === 2" @back="step = 1"></ghana-payroll>

      <kenya-payroll v-if="step === 3" @back="step = 1"></kenya-payroll>

      <s-l-payroll v-if="step === 4" @back="step = 1"></s-l-payroll>
    </v-card-text>
  </span>
</template>

<script>
import VueFlagIcon from "vue-flag-icon";
import GhanaPayroll from "./GhanaPayroll.vue";
import KenyaPayroll from "./KenyaPayroll.vue";
import SLPayroll from "./SLPayroll.vue";
export default {
  name: "GrossToNetCalculator",
  components: {
    SLPayroll,
    KenyaPayroll,
    GhanaPayroll,
    VueFlagIcon,
  },
  data() {
    return {
      contryCodes: ["GH", "KE", "SL"],
      step: 1,
      countries: [
        {
          name: "Ghana",
          code: "GH",
          step: 2,
        },
        {
          name: "Kenya",
          code: "KE",
          step: 3,
        },
        {
          name: "Sierra Leon",
          code: "SL",
          step: 4,
        },
      ],
    };
  },

  mounted() {},
};
</script>

<style scoped></style>
