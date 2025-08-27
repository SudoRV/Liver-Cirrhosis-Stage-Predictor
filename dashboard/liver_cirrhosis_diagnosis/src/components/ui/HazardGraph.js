import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const HazardFunctionChart = ({ timeDays, hazard }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // cleanup old chart
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: timeDays, // x-axis: days
        datasets: [
          {
            label: "Hazard",
            data: hazard, // y-axis: hazard values
            borderWidth: 2,
            borderColor: "#f44336",
            backgroundColor: "rgba(244, 67, 54, 0.2)",
            fill: true,
            tension: 0.3, // smooth curve
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { title: { display: true, text: "Days" } },
          y: {
            title: { display: true, text: "Hazard Rate" },
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current.destroy();
    };
  }, [timeDays, hazard]);

  return <canvas ref={chartRef} />;
};

export default HazardFunctionChart;
