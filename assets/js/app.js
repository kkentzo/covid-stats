import {Chart, registerables} from "chart.js"
Chart.register(...registerables);
import "chartjs-adapter-date-fns"
import { format as formatDate } from "date-fns"

import results from './results.json';

const ctx = document.getElementById('chart-cases').getContext('2d');

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'
    ],

    datasets: results
  },
  options: {
    scales: {
      x: {
        type: "time",
        time: {
          displayFormats: {
            hour: "YYYY MMM dd HH:mm"
          }
        },
        // adapters: {
        //   date: {
        //     locale: getLocale(locale)
        //   }
        // },
        // grid: {
        //   color: "#404040",
        // },
        // stacked: true
      },

      y: {
        beginAtZero: true
      }
    },
    plugins: {
      tooltip: {
        mode: "nearest",
        intersect: true,
        callbacks: {
          title: tooltipTitle
        }
      }
    }
  }
});


function tooltipTitle(tooltipItems) {
  return formatDate(new Date(tooltipItems[0].raw.x), "yyyy-MM-dd")
}
