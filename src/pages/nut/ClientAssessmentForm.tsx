import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

interface Client {
  id: string;
  name: string;
}

const ClientAssessmentForm = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  const getUserAndToken = () => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return { user: null, token: null };
      }

      let user = {};
      if (userStr) {
        try {
          user = JSON.parse(userStr);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
          localStorage.removeItem("user");
          navigate("/login");
          return { user: null, token: null };
        }
      }

      if (!user || typeof user !== "object" || !user.email) {
        navigate("/login");
        return { user: null, token: null };
      }

      return { user, token };
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      navigate("/login");
      return { user: null, token: null };
    }
  };

  const { user, token } = getUserAndToken();
  if (!user || !token) return null;

  useEffect(() => {
    const fetchDetails = async () => {
      const resp = await api.get(`/nuts/clients`, {
        params: { email: user.email },
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(resp.data);
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchAssessData = async () => {
      
      if (selectedClient !== "") {
        
        try {
          const resp = await api.get("/nuts/clientassessment", {
            params: { id: selectedClient },
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(resp.data)
          const data = resp.data[0];
          if (data && Object.keys(data).length > 0) {
            setFormData(data);
          } else {
            setFormData({});
          }
        } catch (err) {
          console.error("Error fetching assessment:", err);
          toast.error("Failed to load previous assessment data.");
          setFormData({});
        }
      }
    };

    fetchAssessData();
  }, [selectedClient]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nutDetails = await api.get(`/nuts/email`, {
      params: { email: user.email },
      headers: { Authorization: `Bearer ${token}` },
    });

    const nutId = nutDetails.data[0].id;

    const payload: Record<string, any> = {
      ...formData,
      clientId: selectedClient,
      nutritionistId: nutId,
    };

    await api.post("/nuts/clientassessment", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Assessment submitted!");
  };

  return (
    <DashboardLayout title="Client Assessment" userRole="nutritionist">
      <motion.div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-2xl space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Client Assessment</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Client</label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Anthropometric Section */}
          <Section title="Anthropometric Details">
            {[
              ["Height (cm)", "height"],
              ["Weight (kg)", "weight"],
              ["Waist circumference (cm)", "waist"],
              ["Hip circumference (cm)", "hip"],
              ["Blood pressure", "bp"],
            ].map(([label, name]) => (
              <Input
                key={name}
                label={label}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
              />
            ))}
          </Section>

          {/* Biochemical Section */}
          <Section title="Biochemical">
            <SelectInput
              label="Blood test in last 6 months?"
              name="bloodTestDone"
              value={formData["bloodTestDone"] || ""}
              onChange={handleChange}
              options={["Yes", "No"]}
            />

            <div className="grid grid-cols-2 gap-3">
              {[
                "FBS", "PPBS", "HBA1C", "LFT", "RFT", "HEMOGRAM", "CUE", "LIPID PROFILE", "CALCIUM",
                "VIT D", "B12", "THYROID", "Electrolytes", "Uric acid",
              ].map((test) => (
                <Input
                  key={test}
                  label={test}
                  name={test.toLowerCase().replace(/ /g, "_")}
                  value={formData[test.toLowerCase().replace(/ /g, "_")] || ""}
                  onChange={handleChange}
                />
              ))}
            </div>

            <TextArea
              label="Known nutrient deficiencies"
              name="deficiencies"
              value={formData["deficiencies"] || ""}
              onChange={handleChange}
            />
            <TextArea
              label="Medications"
              name="medications"
              value={formData["medications"] || ""}
              onChange={handleChange}
            />
            <TextArea
              label="Supplements"
              name="supplements"
              value={formData["supplements"] || ""}
              onChange={handleChange}
            />
            <TextArea
              label="Allergies / Intolerances"
              name="allergies"
              value={formData["allergies"] || ""}
              onChange={handleChange}
            />
          </Section>

          {/* Clinical Section */}
          <Section title="Clinical Details">
            <TextArea
              label="Current health issues"
              name="currentIssues"
              value={formData["currentIssues"] || ""}
              onChange={handleChange}
            />
            <TextArea
              label="Past medical history"
              name="medicalHistory"
              value={formData["medicalHistory"] || ""}
              onChange={handleChange}
            />
            <TextArea
              label="Menstrual health info (if applicable)"
              name="menstrualHealth"
              value={formData["menstrualHealth"] || ""}
              onChange={handleChange}
            />
            <TextArea
              label="Sleep (hours, quality, issues)"
              name="sleep"
              value={formData["sleep"] || ""}
              onChange={handleChange}
            />
          </Section>

          {/* Dietary & Lifestyle */}
          <Section title="Dietary & Lifestyle">
            <TextArea
              label="24-hour Dietary Recall"
              name="dietRecall"
              value={formData["dietRecall"] || ""}
              onChange={handleChange}
            />
            <SelectInput
              label="Food Preferences"
              name="foodPref"
              options={["Veg", "Non-Veg", "Vegan", "Egg"]}
              value={formData["foodPref"] || ""}
              onChange={handleChange}
            />
            <Input
              label="Daily water intake (L)"
              name="waterIntake"
              value={formData["waterIntake"] || ""}
              onChange={handleChange}
            />
            <TextArea
              label="Caffeine / Alcohol / Smoke?"
              name="habits"
              value={formData["habits"] || ""}
              onChange={handleChange}
            />
            <TextArea
              label="Physical activity routine"
              name="activity"
              value={formData["activity"] || ""}
              onChange={handleChange}
            />
          </Section>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
          >
            Submit Assessment
          </button>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t pt-6">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ label, name, onChange, value = "" }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input type="text" name={name} onChange={onChange} value={value} className="w-full p-2 border rounded-md" />
  </div>
);

const TextArea = ({ label, name, onChange, value = "" }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea name={name} rows={3} onChange={onChange} value={value} className="w-full p-2 border rounded-md" />
  </div>
);

const SelectInput = ({ label, name, options, onChange, value = "" }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select name={name} onChange={onChange} value={value} className="w-full p-2 border rounded-md">
      <option value="">Select</option>
      {options.map((o: string) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </div>
);

export default ClientAssessmentForm;
