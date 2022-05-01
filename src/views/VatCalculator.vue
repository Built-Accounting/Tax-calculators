<template>
  <v-row>
    <v-col cols="12" sm="5" class="mx-auto">
      <v-card flat="">
        <v-card-title class="font-weight-light">
          <v-btn @click="$router.back()" variant="plain"
            ><v-icon>mdi-arrow-left</v-icon>Back</v-btn
          ><v-spacer></v-spacer> Tax calculator for
          {{ $route.params.country_code }}
          <flag
            style="width: 50px; height: 20px"
            :iso="$route.params.country_code"
          ></flag>
        </v-card-title>
        <v-card-text>
          <v-menu v-model="taxMenu">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="outlined" block="">
                {{ tax ? tax.display_name : "Select a tax" }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="t in taxes"
                :key="t.id"
                @click="tax = t; taxMenu=false;"
                :active="tax && tax.id == t.id"
              >
                <v-list-item-title>{{ t.display_name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu v-model="typeMenu">
            <template v-slot:activator="{ props }">
              <v-btn v-if="tax" v-bind="props" variant="outlined" block="" class="mt-3">
                {{ type ? type.text : "Select conversion process" }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                  v-for="t in types"
                  :key="t.value"
                  @click="type = t; typeMenu=false"
                  :active="type && type.value == t.value"
              >
                <v-list-item-title>{{ t.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-text-field
            v-if="type && type.value==='AtoA'"
            variant="outlined"
            label="Amount without sales taxes"
            class="mt-3"
            v-model="amount_without_tax"
            autofocus=""
          ></v-text-field>

          <v-text-field
            v-if="type && type.value==='AtoS'"
            variant="outlined"
            label="Amount with sales taxes"
            class="mt-3"
            v-model="amount_with_tax"
            autofocus=""
          ></v-text-field>

          <v-row dense>
            <v-col cols="12" class="text-center">
              <div v-if="type && type.value === 'AtoA' && amount_without_tax">
                <h3 class="font-weight-light">Tax amount:{{ toMoney(CaculatedInclusiveTax()-amount_without_tax) }}</h3>
                <h3 class="font-weight-light">Amount with sales tax:{{ toMoney(CaculatedInclusiveTax())}}</h3>
              </div>
              <div v-if="type && type.value === 'AtoS' && amount_with_tax">
                <p>Original Amount</p>
                <h3 class="font-weight-light">{{ toMoney(calculateTaxExclusive()) }}</h3>
              </div>
            </v-col>
          </v-row>

        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  name: "VatCalculator",
  data() {
    return {
      taxMenu:false,
      typeMenu:false,
      type:null,
      taxes: [],
      progress: false,
      tax: null,
      amount_with_tax: 0,
      amount_without_tax: 0,
      types: [
        {
          text: "Original Amount to Amount with sales taxes",
          value: "AtoA",
        },
        {
          text: "Amount with sales taxes to Original Amount",
          value: "AtoS",
        },
      ],
    };
  },
  methods: {
    toMoney(d) {
      if (d) {
        return Number(d)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,");
      } else {
        return "0.00";
      }
    },
    CaculatedInclusiveTax() {
      if (
        this.amount_without_tax &&
        this.tax.type.toLowerCase() === "compound"
      ) {
        const subTax =
          (Number(this.tax.sub_rate) / 100) * Number(this.amount_without_tax);
        const compoundAmount = subTax + Number(this.amount_without_tax);

        const compoundtax = (Number(this.tax.rate) / 100) * compoundAmount;
        const totalTax = compoundtax + subTax;
        return totalTax + Number(this.amount_without_tax);
      } else if (
        this.amount_without_tax &&
        this.tax.type.toLowerCase() === "flat"
      ) {
        return (
          (Number(this.tax.rate) / 100) * Number(this.amount_without_tax) +
          Number(this.amount_without_tax)
        );
      }
    },
    calculateTaxExclusive() {
      if (this.amount_with_tax && this.tax.type.toLowerCase() === "compound") {
        const amount = 1;
        const subTax = (Number(this.tax.sub_rate) / 100) * Number(amount);
        const compoundAmount = subTax + Number(amount);
        const compoundtax = (Number(this.tax.rate) / 100) * compoundAmount;
        const totalTax = compoundtax + subTax + amount;

        return Number(this.amount_with_tax) / totalTax;
      } else if (
        this.amount_with_tax &&
        this.tax.type.toLowerCase() === "flat"
      ) {
        const amount = 1;
        const totalTax =
          (Number(this.tax.rate) / 100) * Number(amount) + amount;

        return Number(this.amount_with_tax) / totalTax;
      }
    },
    getTaxes() {
      this.progress = true;
      axios
        .get(
          "https://web.builtaccounting.com/api/country/" +
            this.$route.params.country_code +
            "/taxes"
        )
        .then((res) => {
          this.taxes = res.data.data;
        });
    },
  },
  mounted() {
    this.getTaxes();
  },
};
</script>

<style scoped></style>
