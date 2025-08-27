import React from "react";
import { Info } from "lucide-react"; // icon for hints

export default function SurvivalStats({ riskScore, medianSurvivalTime, stagePrediction }) {
  const formattedTime = formatDays(medianSurvivalTime);

  // Decide interpretation of risk score
  let riskConclusion = "";
  if (riskScore < 1) {
    riskConclusion = "Lower than baseline → Safer prognosis.";
  } else if (riskScore === 1) {
    riskConclusion = "Equal to baseline → Average prognosis.";
  } else {
    riskConclusion = "Higher than baseline → Increased risk of mortality.";
  }

  return (
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

      {/* Risk Score */}
      <div className="flex flex-col bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
            Risk Score
            <Info className="w-4 h-4 text-blue-500 cursor-pointer" title="Indicates the relative hazard of mortality compared to the baseline group. Lower values (<1) are safer, >1 suggests higher risk." />
          </h3>
          <span className="text-xl font-bold text-blue-700">
            {riskScore?.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{riskConclusion}</p>

        <div className="text-sm text-gray-600 mt-2 flex flex-wrap items-center gap-2 whitespace-nowrap">
          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
            &lt; 1.0 → Lower risk than baseline
          </div>

          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
            ≈ 1.0 → Average risk
          </div>

          <div className="flex items-center">
            <span className="w-4 h-4 rounded-full bg-red-500 mr-2"></span>
            &gt; 1.0 → Higher risk than baseline
          </div>
        </div>



      </div>

      {/* Median Survival Time */}
      <div className="flex flex-col bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            Median Survival Time
            <Info className="w-4 h-4 text-green-500 cursor-pointer" title="The estimated time when survival probability drops to 50%. It gives a central reference point for prognosis." />
          </h3>
          <span className="text-xl font-bold text-green-700">
            {formattedTime}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          This is the point in time where half the patients are expected to survive. Individual outcomes may vary.
        </p>
      </div>

      {/* Stage Prediction */}
      <div
        className={`flex flex-col rounded-xl p-4 shadow-sm border
    ${stagePrediction?.stage === 1
            ? "bg-gradient-to-r from-green-50 to-green-200 border-green-200"
            : stagePrediction?.stage === 2
              ? "bg-gradient-to-r from-blue-50 to-blue-200 border-blue-200"
              : "bg-gradient-to-r from-red-50 to-red-200 border-red-200"
          }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`text-lg font-semibold flex items-center gap-2 ${stagePrediction?.stage === 1
                ? "text-green-800"
                : stagePrediction?.stage === 2
                  ? "text-blue-800"
                  : "text-red-800"
              }`}
          >
            Stage Prediction
            <Info
              className={`w-4 h-4 cursor-pointer ${stagePrediction?.stage === 1
                  ? "text-green-500"
                  : stagePrediction?.stage === 2
                    ? "text-blue-500"
                    : "text-red-500"
                }`}
              title="The estimated time when survival probability drops to 50%. It gives a central reference point for prognosis."
            />
          </h3>
          <span
            className={`text-xl font-bold ${stagePrediction?.stage === 1
                ? "text-green-700"
                : stagePrediction?.stage === 2
                  ? "text-blue-700"
                  : "text-red-700"
              }`}
          >
            {stagePrediction?.stage} (
            {(stagePrediction?.probs[stagePrediction?.stage - 1] * 100).toFixed(1)}%)
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Prediction of liver cirrhosis stage based on clinical parameters with
          probabilities of stage.
        </p>
      </div>


      {/* AI Disclaimer */}
      <div className="col-span-1 md:col-span-2 mt-2">
        <p className="text-xs text-gray-500 italic text-center">
          ⚠️ This report is AI-generated for awareness and educational purposes.
          It should not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}

// utility
function formatDays(days) {
  if (!days) return "Not Available";
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remDays = Math.floor((days % 365) % 30);
  return `${years}y ${months}m ${remDays}d`;
}
