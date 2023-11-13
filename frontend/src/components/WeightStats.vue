<script setup lang="ts">
</script>

<template>
  <div class="stats_container">
    <header>Stats</header>
    <ul>
      <li>Start weight(kg)</li>
    </ul>
    <table class="weights table table-condensed table-hover">
      <tbody>
      <tr>
        <td class="stats_title">Start weight(kg)</td>
        <td></td>
      </tr>
      <tr>
        <td class="stats_title">BMI</td>
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
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.stats_container {
  order:1;
  border:1px solid #000;
  margin-bottom:10px;
}
</style>
