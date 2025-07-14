import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="grid place-items-center min-h-screen md:grid-cols-2 bg-white px-4 md:px-0">
      <div className="w-full max-w-lg">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Terms and Conditions For Livin Significant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-gray-700 max-h-[75vh] overflow-y-auto pr-2">
            <p>
              These Terms and Conditions ("Agreement") govern the services provided by Livin Significant, a Private Limited Company incorporated under the Companies Act, 2013, having its registered office at [Registered Address] (hereinafter referred to as the “Company”, “we”, “our” or “us”), to its clients (“Client”, “you” or “your”) through its nutritionists, dietitians, or authorised service providers.
            </p>

            <p><strong>1. Data Ownership and Usage</strong><br />
              All information and data provided by the Client shall remain the property of the Company and will be securely maintained. This data may be shared only with authorised nutritionists, employees, or service providers under strict confidentiality.
            </p>

            <p><strong>2. Disclosure of Health and Dietary Information</strong><br />
              Clients must provide accurate and complete health, medical, and lifestyle details. This ensures the safety and effectiveness of the diet plan.
            </p>

            <p><strong>3. Commencement of Services</strong><br />
              Services begin only after the assigned nutritionist confirms receipt of all required inputs. Any concerns about requested information must be raised immediately.
            </p>

            <p><strong>4. Allergy and Medical Condition Disclosure</strong><br />
              Disclosure of allergies or dietary restrictions is mandatory. The Company is not liable for adverse effects caused by non-disclosure.
            </p>

            <p><strong>5. Results and Plan Adjustments</strong><br />
              As each body is unique, results may vary. Clients can request adjustments, which may be made at the Company’s discretion.
            </p>

            <p><strong>6. Communication Policy</strong><br />
              Communication must occur only via the Company’s authorised channels (email, portal, designated phone/messaging apps such as Google Meet, WhatsApp Business). Communications may be monitored for quality and dispute resolution.
            </p>

            <p><strong>7. Breach of Communication Protocol</strong><br />
              Engaging outside official channels is a breach of this Agreement. The Company is not liable and may suspend service without refund.
            </p>

            <p><strong>8. Complaint and Dispute Handling</strong><br />
              Complaints must be submitted directly to the Company. It will investigate and take necessary corrective actions, including reassignment or service review.
            </p>

            <p><strong>9. Failure to Disclose Necessary Information</strong><br />
              The Company is not responsible for ineffective outcomes caused by undisclosed or misleading information from the Client.
            </p>

            <p><strong>10. Refund and Cancellation Policy</strong><br />
              Refunds are only offered for the Silver Package (₹999), with a maximum of ₹500 refundable. No refunds are applicable for plans priced ₹2,499 or above. Clients are advised to start with the Silver Package before upgrading.
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-2">
          <p className="mt-5 text-sm text-center text-gray-500">
            <Link to="/signup" className="text-primary-500 hover:underline">← Back to Home</Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex justify-end items-center pr-20">
        <img
          src="logo.png"
          alt="Nutrition Visual"
          className="max-w-[500px] w-full"
        />
      </div>
    </div>
  );
};

export default Terms;
