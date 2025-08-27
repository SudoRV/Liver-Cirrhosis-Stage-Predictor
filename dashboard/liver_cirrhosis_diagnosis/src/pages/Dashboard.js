import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import logo from "../images/Icon-512.png";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DropdownProvider
} from "../components/ui/Select";

import StageProbGraph from "../components/ui/StageProbsGraph";
import SurvivalCurveChart from "../components/ui/SurvivalGraph";
import HazardFunctionChart from "../components/ui/HazardGraph";
import SurvivalStats from "../components/ui/RiskAssesment";

export default function LiverDashboard() {
  const [patient, setPatient] = useState({
    name: "John Doe",
    age: 50,            // age in days (~50 years)
    sex: "M",              // Male
    drug: "Placebo",       // or "D-penicillamine"
    ascites: "N",          // N = No, Y = Yes
    hepatomegaly: "Y",     // Y = Yes, N = No
    spiders: "N",          // presence of spider angiomas
    edema: "N",            // N = none, S = resolved, Y = despite diuretics
    bilirubin: 1.2,        // mg/dl
    cholesterol: 210.0,    // mg/dl
    albumin: 3.8,          // g/dl
    copper: 110.0,         // µg/day
    alk_phos: 520.0,       // U/liter
    sgot: 85.0,            // U/ml
    tryglicerides: 140.0,  // mg/dl
    platelets: 250.0,      // per 1000/ml
    prothrombin: 10.5      // seconds
  });

  const [graphData, setGraphData] = useState(null);


  function prepareData(event) {
    event.preventDefault();

    // prepare form data 
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    delete data["Patient_Name"];
    data["Age"] = data["Age"] * 365;

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        setGraphData(data);
        // console.log(data)
      })
      .catch(err => console.error("Error:", err));

  }

  const handleChange = (field, value) => {
    setPatient({ ...patient, [field]: value });
  };

  return (
    <DropdownProvider>
      <header className="flex items-center">
        <img className="w-20" src={logo} alt="logo"></img>
        <h1 className="text-2xl font-extrabold m-5">Liver Cirrhosis Stage Diagnosis System</h1>
      </header>
      <form onSubmit={(event) => { prepareData(event) }} className="p-6 flex flex-col md:grid md:grid-cols-3 gap-6">
        {/* Patient Info */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Patient Name"
              value={patient.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              placeholder="Age"
              type="number"
              value={patient.age}
              onChange={(e) => handleChange("age", e.target.value)}
            />
            <Select id="sex" label="Sex" value={patient.sex} onValueChange={(v) => handleChange("sex", v)}>
              <SelectTrigger>
                <SelectValue value={patient.sex} placeholder="Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Male</SelectItem>
                <SelectItem value="F">Female</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Medical Features */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Medical Features</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 usm:grid-cols-2 lg_mid:grid-cols-3 gap-3">
            <Select id="drug" label="Drug" value={patient.drug} onValueChange={(v) => handleChange("drug", v)}>
              <SelectTrigger>
                <SelectValue value={patient.drug} placeholder="Drug" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Placebo">Placebo</SelectItem>
                <SelectItem value="D-penicillamine">D-penicillamine</SelectItem>
              </SelectContent>
            </Select>

            <Select id="ascites" label="Ascites" value={patient.ascites} onValueChange={(v) => handleChange("ascites", v)}>
              <SelectTrigger>
                <SelectValue value={patient.ascites} placeholder="Ascites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Y">Yes</SelectItem>
                <SelectItem value="N">No</SelectItem>
              </SelectContent>
            </Select>

            <Select id="hepatomegaly" label="Hepatomegaly" value={patient.hepatomegaly} onValueChange={(v) => handleChange("hepatomegaly", v)}>
              <SelectTrigger>
                <SelectValue value={patient.hepatomegaly} placeholder="Hepatomegaly" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Y">Yes</SelectItem>
                <SelectItem value="N">No</SelectItem>
              </SelectContent>
            </Select>

            <Select id="spiders" label="Spiders" value={patient.spiders} onValueChange={(v) => handleChange("spiders", v)}>
              <SelectTrigger>
                <SelectValue value={patient.spiders} placeholder="Spiders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Y">Yes</SelectItem>
                <SelectItem value="N">No</SelectItem>
              </SelectContent>
            </Select>

            <Select id="edema" label="Edema" value={patient.edema} onValueChange={(v) => handleChange("edema", v)}>
              <SelectTrigger>
                <SelectValue value={patient.edema} placeholder="Edema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="S">Resolved (diuretics)</SelectItem>
                <SelectItem value="Y">Yes</SelectItem>
                <SelectItem value="N">No</SelectItem>
              </SelectContent>
            </Select>

            {/* Numeric features */}
            <Input placeholder="Bilirubin" type="number" value={patient.bilirubin} onChange={(e) => handleChange("bilirubin", e.target.value)} />
            <Input placeholder="Cholesterol" type="number" value={patient.cholesterol} onChange={(e) => handleChange("cholesterol", e.target.value)} />
            <Input placeholder="Albumin" type="number" value={patient.albumin} onChange={(e) => handleChange("albumin", e.target.value)} />
            <Input placeholder="Copper" type="number" value={patient.copper} onChange={(e) => handleChange("copper", e.target.value)} />
            <Input placeholder="Alk Phos" type="number" value={patient.alk_phos} onChange={(e) => handleChange("alk_phos", e.target.value)} />
            <Input placeholder="SGOT" type="number" value={patient.sgot} onChange={(e) => handleChange("sgot", e.target.value)} />
            <Input placeholder="Tryglicerides" type="number" value={patient.tryglicerides} onChange={(e) => handleChange("tryglicerides", e.target.value)} />
            <Input placeholder="Platelets" type="number" value={patient.platelets} onChange={(e) => handleChange("platelets", e.target.value)} />
            <Input placeholder="Prothrombin" type="number" value={patient.prothrombin} onChange={(e) => handleChange("prothrombin", e.target.value)} />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="col-span-3 flex justify-end gap-4">
          {/* <Button className="w-40">Predict Stage</Button> */}
          <Button variant="outline" className="w-40">Generate Report</Button>
        </div>
      </form>

      {/* Graph Region */}
      <Card className="col-span-3 mt-4 m-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Analysis & Visuals
          </CardTitle>
        </CardHeader>

        <SurvivalStats riskScore={graphData?.survival_prediction?.risk_score} medianSurvivalTime={graphData?.survival_prediction?.median_survival_time} stagePrediction={graphData?.stage_prediction} ></SurvivalStats>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Stage Probabilities */}
            <div className="bg-white shadow-md rounded-2xl p-4">
              <h3 className="text-lg font-medium mb-3 text-gray-700">Stage Probability</h3>
              <div className="h-72 w-full flex items-center">
                <StageProbGraph probs={graphData?.stage_prediction?.probs} />
              </div>
            </div>

            {/* Survival Curve */}
            <div className="bg-white shadow-md rounded-2xl p-4">
              <h3 className="text-lg font-medium mb-3 text-gray-700">Survival Curve</h3>
              <div className="h-72 w-full flex items-center">
                <SurvivalCurveChart
                  timeDays={graphData?.survival_prediction?.time_days}
                  survivalProbs={graphData?.survival_prediction?.survival_probs}
                />
              </div>
            </div>

            {/* Hazard Function */}
            <div className="bg-white shadow-md rounded-2xl p-4">
              <h3 className="text-lg font-medium mb-3 text-gray-700">Hazard Function</h3>
              <div className="h-72 w-full flex items-center">
                <HazardFunctionChart
                  timeDays={graphData?.survival_prediction?.time_days}
                  hazard={graphData?.survival_prediction?.hazard}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


    </DropdownProvider>
  );
}
