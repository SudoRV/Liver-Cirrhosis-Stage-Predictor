import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const StageProbGraph = ({ labels, probs }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // destroy old chart before re-rendering
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Stage 1", "Stage 2", "Stage 3"],
        datasets: [
          {
            label: "Probability",
            data: probs, // [0.2, 0.6, 0.2] from backend
            backgroundColor: ["#419644ff", "#266dcaff", "#d84a37ff"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      chartInstanceRef.current.destroy();
    };
  }, [probs]);

  return <canvas ref={chartRef} />;
};

export default StageProbGraph;
