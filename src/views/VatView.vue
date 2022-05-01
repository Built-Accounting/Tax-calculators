<template>

<v-row>

  <v-col cols="12" sm="4" class="mx-auto">
    <v-card flat>
      <v-card-title class="font-weight-light">
        <v-btn @click="$router.back()" variant="plain"
        ><v-icon>mdi-arrow-left</v-icon>Back</v-btn
        ><v-spacer></v-spacer>
        Select a country
      </v-card-title>
      <v-card-text>

        <v-progress-circular
            color="primary"
            indeterminate size="50" v-if="progress"></v-progress-circular>
        <v-list v-else>
          <v-list-item
            v-for="country in countries"
            :key="country.id"
            :to="'/vat/'+country.code"
          >
            <v-list-item-avatar start>
              <flag
                  style="width: 100px; height: 70px"
                  :iso="country.code"
              ></flag>
            </v-list-item-avatar>

            <v-list-item-title>{{country.name}}</v-list-item-title>
            <v-spacer></v-spacer>
            <v-list-item-icon end icon="mdi-chevron-right" class="text-grey">
            </v-list-item-icon>
          </v-list-item>
        </v-list>

      </v-card-text>

    </v-card>
  </v-col>
</v-row>

</template>

<script>
import axios from "axios";
export default {
  name: "VatView",
  data(){
    return{
      countries:[],
      progress:false
    }
  },
  methods:{
    getCountries(){
      this.progress=true;
      axios.get("https://web.builtaccounting.com/api/countries/with-taxes")
      .then(res=>{

        this.countries = res.data.data;
        this.progress=false;

      })

    }
  },
  mounted() {
    this.getCountries();
  }
}
</script>

<style scoped>

</style>