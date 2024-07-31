<script setup lang="ts">

  definePageMeta({
    layout: 'navbar',
    title: 'Dashboard',
    middleware: ['user-middleware', 'admin-middleware']
  });

  //Call chart function
  const chartAreaOptions = computed(() => ({
    chart: {
      type: 'area',
      animation: {
        enabled: false
      }
    },
    title: {
      text: 'Sales yearly',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'],
    },
    yAxis: {
      title: {
        text: 'Sales',
      }
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true
        },
        enableMouseTracking: false
      }
    },
    series: [
      {
        name: 'Sales',
        data: [50, 100, 40, 200, 250, 400, 500, 450, 410, 550, 600]
      }
    ]
  }));
  const chartPieOptions = computed(() => ({
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Best-selling product'
    },
    tooltip: {
      enabled: true // Show the tooltip
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f} %', // Display percentage inside each slice
          distance: -30, // Adjust the distance of the data labels from the center
          style: {
            color: 'white', // Color of the text
            textOutline: 'none', // Remove the text outline
          }
        },
        showInLegend: true // Show the legend
      }
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
    },
    series: [{
      name: 'Browsers',
      colorByPoint: true,
      data: [{
        name: 'Chrome',
        y: 61.41,
        sliced: true,
        selected: true
      }, {
        name: 'Internet Explorer',
        y: 11.84
      }, {
        name: 'Firefox',
        y: 10.85
      }, {
        name: 'Edge',
        y: 4.67
      }, {
        name: 'Safari',
        y: 4.18
      }, {
        name: 'Other',
        y: 7.05
      }]
    }]
  }));
</script>

<template>
  <div>
    <Title>Dashboard</Title>
    <ATypographyTitle class="flex" style="font-size: 20px;">
      <user-outlined  />&nbsp;
      <span>Dashboard</span>
    </ATypographyTitle>
    <a-row :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <ACard class="card-space">
            <ASpace direction="horizontal">
              <ShoppingOutlined class="primary-color icon-space"/>
              <CountDown :limit="100"/>
            </ASpace>
          </ACard>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <ACard class="card-space">
            <ASpace direction="horizontal">
              <IconsShopify class="info-color" style="font-size: 35px;"/>
              <CountDown :limit="500"/>
            </ASpace>
          </ACard>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <ACard class="card-space">
            <ASpace direction="horizontal">
              <ShoppingCartOutlined class="success-color icon-space"/>
              <CountDown :limit="300"/>
            </ASpace>
          </ACard>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="6">
        <div class="gutter-box">
          <ACard class="card-space">
            <ASpace direction="horizontal">
              <ShopOutlined class="warning-color icon-space"/>
              <CountDown :limit="600"/>
            </ASpace>
          </ACard>
        </div>
      </a-col>
    </a-row>
    <a-row class="mt-8" :gutter="{ xs: 8, sm: 16, md: 24, lg: 32 }">
      <a-col class="gutter-row" :span="14">
        <div class="gutter-box">
          <ACard class="card-space">
            <highchart :options="chartAreaOptions" style="min-height: 440px;"/>
          </ACard>
        </div>
      </a-col>
      <a-col class="gutter-row" :span="10">
        <div class="gutter-box">
          <ACard class="card-space">
            <highchart :options="chartPieOptions" style="min-height: 440px;"/>
          </ACard>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
  .icon-space {
    font-size: 30px;
  }
  .card-space {
    box-shadow: rgba(0,0,0,0.24) 0 5px 20px;
  }
</style>