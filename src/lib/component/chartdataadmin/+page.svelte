<script>
  import { Line } from 'svelte-chartjs';
  import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
  import * as Card from "$lib/components/ui/card";


  // Register Chart.js components
  ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

  // Chart data and options
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        data: [0, 59, 80, 81, 56, 55, 40],
      },
      {
        label: 'My Secound dataset',
        backgroundColor: 'blue',
        borderColor: 'blue',
        data: [0, 22, 30, 81, 59, 52, 20],
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
</script>


  <Line {data} {options} />



