<script setup lang="ts"></script>

<template>
  <div class="stats_container">
    <header>Stats</header>
    <table class="table table-sm table-hover">
      <tbody>
        <tr>
          <td class="stats_title">Start weight(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Current weight(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Target weight(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Weight to target(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Lowest weight(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Highest weight(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Average weight(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Change last week(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Change last month(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Change last year(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">Change highest(kg)</td>
          <td></td>
        </tr>
        <tr>
          <td class="stats_title">BMI</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.stats_container {
  order: 1;
  margin-bottom: 10px;
}
table {
  font-size: 0.75em;
  line-height: 15px;
  margin-bottom: 10px;
}
td:first-child {
  padding-left: 0.9em;
}
</style>
