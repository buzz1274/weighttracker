<script setup>
import { ref, computed } from 'vue';
import { useStore } from '@/stores/store'
import moment from 'moment';

const store = useStore()
const page = ref(1)
const paging_limit = 10

const weights = computed(() => {
  if(store.weights) {
    return store.weights.slice(
        (page.value - 1) * paging_limit,
        (page.value * paging_limit)
    )
  }
})

const add_weight = () => {
  console.log("ADD WEIGHT")
}

const delete_weight = (id) => {
  console.log("DELETE WEIGHT " + id)
}

const edit_weight = (id) => {
  console.log("EDIT WEIGHT " + id)
}

const total_pages = computed(() => {
  if(store.weights) {
    return Math.floor(store.weights.length / paging_limit)
  }
})

const paginate = (next_page) => {
  page.value = next_page
}

const changeClass = (change) => {
  return (change < 0 ? 'table-success text-success' : 'table-danger text-danger') + ' text-end fw-bold'
};

</script>

<template>
  <div class="weight_history_container">
    <header>
      History
      <span class="float-end add_weight">
        <font-awesome-icon icon="fa-solid fa-plus" @click="add_weight()" />
      </span>
    </header>
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight(kg)</th>
          <th>Change(kg)</th>
          <th class="text-center">-</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="weights" v-for="weight in weights" :key="weight.id">
          <td style="width:45%">{{ moment(weight.date).format('MMMM Do, YYYY') }}</td>
          <td class="text-end" style="width:10%">{{ weight.weight }}</td>
          <td :class='changeClass(weight.change)' style="width:10%">{{ weight.change }}</td>
          <td class="text-center">
            <span class="action">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" @click="edit_weight(weight.id)" />
            </span>
            <span class="action">
              <font-awesome-icon icon="fa-solid fa-trash" @click="delete_weight(weight.id)" />
            </span>
          </td>
        </tr>
        <tr v-else>
          <td colspan="4" class="text-center">Loading...</td>
        </tr>
      </tbody>
    </table>
    <div v-if="weights" class="history_navigation">
      <p v-if="page < total_pages" class="float-end" @click="paginate(page + 1)">Next&raquo;&raquo;</p>
      <p v-if="page > 1" @click="paginate(page - 1)">&laquo;&laquo;Previous</p>
    </div>
  </div>
</template>

<style scoped>
font-awesome-icon {
  margin:0;
  padding:0;
}
.weight_history_container {
  order:2;
}
.history_navigation {
  width:70%;
  margin:0 auto;
  cursor: pointer;
}
table {
  font-size:0.75em;
  line-height: 15px;
  margin-bottom:10px;
}
.add_weight {
  margin-right:20px;
  cursor: pointer;
}
th {
  font-weight: bold;
}
span.action {
  margin-right:5px;
  cursor: pointer;
}
p {
  font-size:0.75em;
  font-weight: bold;
  margin:0; padding:0;
}
</style>