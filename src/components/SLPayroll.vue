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
            Gross-to-net calculator (<flag iso="SL"></flag> Sierra Leon)
          </h1>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-form ref="payForm">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="DATE/PERIOD"
                      type="date"
                      v-model="date"
                      variant="outlined"
                      density="compact"
                      :disabled="progress"
                      hint="Due to changing rules, this date would be used to determine how to handle the calculations"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      autofocus
                      variant="outlined"
                      density="compact"
                      label="BASIC SALARY"
                      type="number"
                      v-model="basic_amount"
                      :rules="requiredRule"
                      :disabled="progress"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      label="ALLOWANCE"
                      type="number"
                      v-model="allowance"
                      :disabled="progress"
                    ></v-text-field>

                    <v-text-field
                      variant="outlined"
                      density="compact"
                      label="BONUS"
                      type="number"
                      v-model="bonus"
                      :disabled="progress"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      variant="outlined"
                      density="compact"
                      label="REIMBURSEMENT"
                      type="number"
                      v-model="reimbursement"
                      :disabled="progress"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      variant="outlined"
                      density="compact"
                      label="RESIDENTIAL STATUS"
                      :items="statuses"
                      v-model="status"
                      :disabled="progress"
                    ></v-select>
                  </v-col>

                  <v-col cols="12" v-if="status === 'resident'">
                    <v-row dense>
                      <v-col cols="8">
                        <h3 class="font-weight-light">Deduct NASSIT:</h3>
                      </v-col>
                      <v-col cols="4">
                        <v-switch
                          :disabled="progress"
                          v-model="deduct_pension"
                          flat
                          inset
                          color="blue darken-4"
                          class="ma-0"
                          dense
                        ></v-switch>
                      </v-col>
                    </v-row>
                  </v-col>

                  <v-col cols="12">
                    <v-row dense>
                      <v-col cols="8">
                        <h3 class="font-weight-light">Deduct income tax:</h3>
                      </v-col>
                      <v-col cols="4">
                        <v-switch
                          :disabled="progress"
                          v-model="deduct_paye"
                          flat
                          inset
                          color="blue darken-4"
                          class="ma-0"
                          dense
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
                    <td>
                      <h3 class="font-weight-bold">Basic Salary:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.basic_pay) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Taxable Income:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.taxable_income) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" class="bg-light text-center">
                      <i>Earnings</i>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Allowance:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.allowance) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Bonus:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.bonus) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">Reimbursement:</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.reimbursement) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
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
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
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
                        {{ currency }}{{ toMoney(result.paye) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <h3 class="font-weight-bold">NASSIT :</h3>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.nassit) }}
                      </h3>
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
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
                      <h3 v-else>{{ currency }}{{ 0.00 }}</h3>
                    </td>
                  </tr>

                  <tr class="bg-light">
                    <td>
                      <h2 class="font-weight-light">Net Pay:</h2>
                    </td>
                    <td class="text-right">
                      <h3 v-if="result">
                        {{ currency }}{{ toMoney(result.net_pay)  }}
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
    </v-col></v-row
  >
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  name: "SLPayroll",
  data() {
    return {
      currency: "SSL",
      error: false,
      error_message: "",
      result: null,
      allowance: 0,
      bonus: 0,
      basic_amount: 0,
      reimbursement: 0,
      date: "",
      dateMenu: false,
      status: "resident",
      deduct_pension: false,
      deduct_paye: false,
      progress: false,
      requiredRule: [(v) => !!v || "This field is required"],
      statuses: ["resident", "nonresident"],
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
    calculate() {
      if (this.$refs.payForm.validate()) {
        this.progress = true;
        const formData = new FormData();
        formData.append("basic_pay", this.basic_amount);
        formData.append("bonus", this.bonus);
        formData.append("allowance", this.allowance);
        formData.append("status", this.status);
        formData.append("date", this.date);
        formData.append("deduct_pension", this.deduct_pension);
        formData.append("deduct_paye", this.deduct_paye);
        formData.append("reimbursement", this.reimbursement);
        axios
          .post(
            "https://web.builtaccounting.com/api/payroll/sl/gross-to-net",
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
