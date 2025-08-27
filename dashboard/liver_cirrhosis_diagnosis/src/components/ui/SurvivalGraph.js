import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const SurvivalCurveChart = ({ timeDays, survivalProbs }) => {
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
            label: "Survival Probability",
            data: survivalProbs, // y-axis: probability
            borderWidth: 1,
            borderColor: "#2196f3",
            backgroundColor: "rgba(33, 150, 243, 0.2)",
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
            title: { display: true, text: "Survival Probability" },
            min: 0,
            max: 1,
          },
        },
      },
    });

    return () => {
      chartInstanceRef.current.destroy();
    };
  }, [timeDays, survivalProbs]);

  return <canvas ref={chartRef} />;
};

export default SurvivalCurveChart;
