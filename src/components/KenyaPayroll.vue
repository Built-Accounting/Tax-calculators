<template>
  <v-row>
    <v-col cols="12" sm="10" class="mx-auto">
      <v-card flat>
        <v-card-title>
          <v-btn variant="plain" rounded @click="$emit('back')"
            ><v-icon>mdi-menu</v-icon>Main Menu</v-btn
          >
          <v-spacer></v-spacer>
          <h1 class="font-weight-light">
            Gross-to-net calculator (<flag iso="KE"></flag> Kenya)
          </h1>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-form ref="payForm">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      variant="outlined"
                      label="DATE/PERIOD"
                      type="date"
                      v-model="date"
                      density="compact"
                      :disabled="progress"
                      hint="Due to changing rules, this date would be used to determine how to handle the calculations"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      autofocus
                      density="compact"
                      variant="outlined"
                      label="BASIC SALARY"
                      type="number"
                      v-model="basic_amount"
                      :rules="requiredRule"
                      :disabled="progress"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      density="compact"
                      variant="outlined"
                      label="BENEFITS(BONUS,ALLOWANCE)"
                      type="number"
                      v-model="benefits"
                      :disabled="progress"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      density="compact"
                      variant="outlined"
                      label="OTHER PENSIONS"
                      type="number"
                      v-model="other_pensions"
                      :disabled="progress"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-row dense>
                      <v-col cols="8">
                        <h3 class="font-weight-light">Deduct NSSF:</h3>
                      </v-col>
                      <v-col cols="4">
                        <v-switch
                          :disabled="progress"
                          v-model="deduct_nssf"
                          flat
                          inset
                          color="blue darken-4"
                          class="ma-0"
                          dense
                        ></v-switch>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12" v-if="deduct_nssf">
                    <v-select
                      density="compact"
                      variant="outlined"
                      label="NSSF RATES"
                      :items="nssfRateList"
                      v-model="nssfRate"
                      :disabled="progress"
                    ></v-select>
                  </v-col>

                  <v-col cols="12">
                    <v-row dense>
                      <v-col cols="8">
                        <h3 class="font-weight-light">Deduct NHIF:</h3>
                      </v-col>
                      <v-col cols="4">
                        <v-switch
                          :disabled="progress"
                          v-model="deduct_nhif"
                          inset
                          color="blue darken-4"
                          class="ma-0"
                          density="compact"
                        ></v-switch>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      :loading="progress"
                      @click="calculate()"
                      large
                      color="success"
                      dark
                      rounded
                      block
                      flat
                      >Calculate</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
            <v-divider vertical></v-divider>

            <v-col cols="8">
              <v-table class="table table-bordered">
                <tbody>
                  <tr>
                    <td colspan="2" class="bg-light text-center">
                      <i>Earnings</i>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Basic Salary:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.basic_pay) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Benefits:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.benefits) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Gross Salary:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.gross_pay) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="bg-light text-center">
                      <i>Deductions</i>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">P.A.Y.E:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.net_paye) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">NSSF:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.nssf) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">NHIF:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.nhif) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Other Pensions:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.other_pensions) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Total Deductions:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.total_deductions) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr class="bg-light">
                    <td>
                      <h2 class="font-weight-light">Net Pay:</h2>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.net_pay) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2" class="bg-light text-center">
                      <i>Taxations</i>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Chargeable Pay:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.chargeable_income) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Tax Charged:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency
                        }}{{
                          toMoney(
                            result.net_paye +
                              result.personal_relief +
                              result.nhif_relief
                          )
                        }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.0 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Personal Relief:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.personal_relief) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3 class="font-weight-bold">NHIF Relief(15%):</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.nhif_relief) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Net Tax:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.net_paye) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Pension Relief:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.pension_relief) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-col>
          </v-row>

          <v-snackbar color="red" v-model="error">{{
            error_message
          }}</v-snackbar>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
import axios from "axios";

export default {
  name: "KenyaPayroll",
  data() {
    return {
      currency: "KSH",
      other_pensions: 0,
      nssfRate: "New rates(tiered)",
      error: false,
      error_message: "",
      result: null,
      basic_amount: 0,
      benefits: 0,
      date: "",
      dateMenu: false,
      status: "resident",
      deduct_nssf: false,
      deduct_nhif: false,
      progress: false,
      requiredRule: [(v) => !!v || "This field is required"],
      nssfRates: [
        {
          value: "new_method",
          text: "New rates(tiered)",
        },
        {
          value: "old_method",
          text: "Old rate (KSH200)",
        },
      ],
      nssfRateList: ["New rates(tiered)", "Old rate (KSH200)"],
      statuses: [
        {
          text: "Resident",
          value: "resident",
        },
        {
          text: "Non-resident",
          value: "nonresident",
        },
      ],
    };
  },
  computed: {
    getSelectedrate() {
      const rate = this.nssfRates.find((r) => r.text === this.nssfRate);
      return rate.value;
    },
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
    calculate() {
      if (this.$refs.payForm.validate()) {
        this.progress = true;
        const formData = new FormData();
        formData.append("basic_pay", this.basic_amount);
        formData.append("benefits", this.benefits);
        formData.append("status", this.status);
        formData.append("date", this.date);
        formData.append("deduct_nssf", this.deduct_nssf);
        formData.append("deduct_nhif", this.deduct_nhif);
        formData.append("nssf_rate", this.getSelectedrate);
        formData.append("other_pensions", this.other_pensions);
        axios
          .post(
            "https://web.builtaccounting.com/api/payroll/ke/gross-to-net",
            formData
          )
          .then((res) => {
            this.result = res.data.data;

            this.progress = false;
          })
          .catch((error) => {
            this.progress = false;
            this.error_message = "Something went wrong, please try again";
            this.error = true;
          });
      }
    },
  },
  mounted() {
    this.date = moment().format("Y-MM-DD");
  },
};
</script>

<style scoped></style>
