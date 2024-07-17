<script lang="ts">
    import { Bar } from 'svelte-chartjs';
    import { Chart, registerables } from 'chart.js';
    import * as Card from "$lib/components/ui/card";
    // Register Chart.js components
    Chart.register(...registerables);

    const getLabels = () => {
    const currentDate = new Date();
    const currentDayIndex = currentDate.getDate();
    const currentMonthIndex = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const labels = [];
    const month = new Date(currentYear, currentMonthIndex, 1).toLocaleDateString('en-US', { month: 'short' });
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate(); // Get number of days in current month

    for (let day = 1; day <= daysInMonth; day++) {
        if(day <= currentDayIndex){
            labels.push(`${month} ${day}`);
        }
      
    }
    // console.log(currentDate ,' currentIndex  : ',currentDayIndex,currentMonthIndex ,currentYear)
    return labels;
  };
    // Sample data for the bar chart
    const data = {
      labels: getLabels(),
      datasets: [
        {
          label: 'สลิปจริง',
          data: [{ x: 'Jul 7', y: 15 }, { x: 'Jul 9', y: 8 }, { x: 'Jul 10', y: 9 }, { x: 'Nov 8', y: 9 }, { x: 'Jul 5', y: 9 }, { x: 'Jul 1', y: 9 },{ x: 'Jul 2', y: 9 },{ x: 'Jul 18', y: 9 },1,1,1],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'สลิปปลอม',
          data: [8, 8, 8, 8, 8, 8,9,9,9,9], // ตั้งค่าให้มีค่าเท่ากันสำหรับทุกเดือน
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }
      ]
    };
    
    // Chart options
    const options = {
    responsive: true,
    plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true
        },
        mode: 'xy',
      },
      pan: {
        enabled: true,
        mode: 'xy',
      }
    },
  },
    animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  scales: {
    x: {
      ticks: {
        color: 'black', // ตั้งค่าสีของอักษรบนแกน x
        font: {
          size: 10, // ตั้งค่าขนาดตัวอักษร
          weight: 'normal' // ตั้งค่าความหนาของตัวอักษร
        }
      },
      grid: {
        display: false, // ไม่แสดง grid lines บนแกน x
      }
    },
    y: {
      ticks: {
        color: 'black', // ตั้งค่าสีของอักษรบนแกน y
        font: {
          size: 10, // ตั้งค่าขนาดตัวอักษร
          weight: 'normal' // ตั้งค่าความหนาของตัวอักษร
        }
      },
      grid: {
        display: false, // ไม่แสดง grid lines บนแกน y
      }
    }
  }
  };

  
  </script>


<Bar {data} {options}  style="height:300px;width:100%"/>