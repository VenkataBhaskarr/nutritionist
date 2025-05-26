// src/pages/Calculator.tsx
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Calculator = () => {
  const [tab, setTab] = useState<"BMI" | "BMR">("BMI");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [color, setColor] = useState("");
  const [infoLink, setInfoLink] = useState("")
  const navigate = useNavigate();

  const handleInfoLink = () => {
    navigate(infoLink)
  }
  const getBmiCategory = (bmi: number) => {
    if (bmi < 16) return { label: "Severe Underweight", color: "text-red-600", info: "/blogs/1"};
    if (bmi < 18.5) return { label: "Mild Underweight", color: "text-yellow-500", info: "/blogs/2" };
    if (bmi < 25) return { label: "Normal", color: "text-green-600", info: "/blogs/3" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-600", info: "/blogs/4" };
    if (bmi < 40) return { label: "Obese", color: "text-red-600", info: "/blogs/5" };
    return { label: "Severe Obese", color: "text-red-800", info: "/blogs/6" };
  };

  const calculate = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);
    if (tab === "BMI" && h > 0) {
      const bmi = w / ((h / 100) ** 2);
      const { label, color, info } = getBmiCategory(bmi);
      setResult(`Your BMI is ${bmi.toFixed(2)}`);
      setInfoLink(info)
      setInterpretation(`This is considered: ${label}`);
      setColor(color);
    } else if (tab === "BMR" && h > 0 && a > 0) {
      const bmr =
        gender === "male"
          ? 10 * w + 6.25 * h - 5 * a + 5
          : 10 * w + 6.25 * h - 5 * a - 161;
      setResult(`Your BMR is ${bmr.toFixed(0)} calories/day`);
      setInterpretation(
        `This is the number of calories your body burns at rest. Multiply by your activity level to estimate daily needs.`
      );
      setColor("text-gray-700");
    }
  };

  return (
    <div id="calculator" className="min-h-screen flex flex-col">
      <NavBar />

      <section className="pt-20 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-6">BMI & BMR Calculator</h1>

          <div className="flex justify-center mb-8 gap-5">
            <Button
              className={`px-6 py-3 rounded-l-xl hover:bg-lime-400 ${tab === "BMI" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setTab("BMI")}
            >
              BMI
            </Button>
            <Button
              className={`px-6 py-3 rounded-r-xl hover:bg-lime-400 ${tab === "BMR" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setTab("BMR")}
            >
              BMR
            </Button>
          </div>

          <div className="max-w-xl mx-auto bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
            <div className="grid gap-4">
              <input
                type="number"
                placeholder="Age"
                className="input border p-3 rounded-md"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input border p-3 rounded-md"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="number"
                placeholder="Height (cm)"
                className="input border p-3 rounded-md"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                className="input border p-3 rounded-md"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <Button
                className="bg-primary-500 text-white hover:bg-green-600"
                onClick={calculate}
              >
                Calculate
              </Button>
            </div>

            {result && (
              <div className="text-center mt-6">
                <p className="text-lg font-semibold mb-2">{result}</p>
                <p className={`text-md font-medium ${color}`}>{interpretation}</p>
                <br></br>
                <Button onClick={handleInfoLink} className="{text-md font-semibold mb-2}">Learn more about your condition</Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Calculator;
