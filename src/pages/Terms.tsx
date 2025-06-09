import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {

  return (
    <div className="grid place-items-center min-h-screen md:grid-cols-2 bg-white">
        <div className="w-full max-w-lg">
            <Card className="shadow-md border border-gray-200">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-semibold">
                   Terms and Conditions For Living Significant
                </CardTitle>
            </CardHeader>
            <CardContent>
                // Blah blah bhal
            </CardContent>
            </Card>
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
