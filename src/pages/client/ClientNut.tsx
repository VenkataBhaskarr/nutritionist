import { FC, useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Nutritionist {
  id: number;
  name: string;
  email: string;
  profilePicUrl?: string;
  specialization: string;
  bio?: string;
  phone: string;
  experience?: string;
  location?: string;
}

const MyNutritionist: FC = () => {
  const [nutritionist, setNutritionist] = useState<Nutritionist | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nutRes = await api.get(`/client/nut`, {
          params: { email: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        const nut = nutRes.data?.[0];
        if (!nut) throw new Error("No nutritionist assigned");

        setNutritionist(nut);

        const ratingRes = await api.get(`/nuts/rating`, {
          params: { nutId: nut.id, clientEmail: user.email },
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedRating = ratingRes.data?.[0]?.rating;
        if (fetchedRating) setRating(fetchedRating);
      } catch (err) {
        toast.error("Failed to load nutritionist info");
        console.error("Error loading nutritionist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRating = async (value: number) => {
    if (!nutritionist) return;

    setRating(value);
    try {
      await api.post(
        "/client/rateNutritionist",
        {
          nutId: nutritionist.id,
          clientEmail: user.email,
          rating: value,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Thanks for rating!");
    } catch (err) {
      toast.error("Failed to submit rating");
      console.error("Rating submission error:", err);
    }
  };

  // 🔄 Loading Skeleton
  if (loading) {
    return (
      <DashboardLayout title="My Nutritionist" userRole="client">
        <div className="space-y-4 p-6">
          <Skeleton className="h-48 w-48 rounded-full mx-auto" />
          <Skeleton className="h-6 w-1/3 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  // ❌ No Nutritionist Case
  if (!nutritionist) {
    return (
      <DashboardLayout title="My Nutritionist" userRole="client">
        <div className="p-6 text-center text-muted-foreground text-sm">
          No nutritionist assigned to you yet.
        </div>
      </DashboardLayout>
    );
  }

  // ✅ Final Render
  return (
    <DashboardLayout title="My Nutritionist" userRole="client">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Profile */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={nutritionist.profilePicUrl || "/default-avatar.png"}
            alt={nutritionist.name}
            className="h-44 w-44 rounded-full object-cover shadow-lg border-4 border-green-100"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {nutritionist.name}
            </h1>
            <p className="text-sm text-green-700 font-medium mt-1">
              {nutritionist.specialization}
            </p>
            <p
              className={`mt-2 text-sm text-muted-foreground transition-all duration-300 ${
                isBioExpanded ? "" : "line-clamp-3"
              }`}
            >
              {nutritionist.bio || "No bio available."}
            </p>
            {nutritionist.bio && (
              <Button
                variant="link"
                className="mt-1 text-xs text-green-600 hover:underline"
                onClick={() => setIsBioExpanded(!isBioExpanded)}
              >
                {isBioExpanded ? "Show Less" : "Read More"}
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Contact & Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-800">Contact</h2>
            <p>
              <span className="font-medium">Email:</span>{" "}
              <a
                href={`mailto:${nutritionist.email}`}
                className="text-green-600 hover:underline"
              >
                {nutritionist.email}
              </a>
            </p>
            <p>
              <span className="font-medium">Rating:</span>{" "}
              <span className="text-yellow-500">{rating || "Unrated"}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold text-gray-800">Details</h2>
            <p>
              <span className="font-medium">Experience:</span>{" "}
              {nutritionist.experience || "N/A"}
            </p>
            <p>
              <span className="font-medium">Location:</span>{" "}
              {nutritionist.location || "N/A"}
            </p>
            <p>
              <span className="font-medium">Specialization:</span>{" "}
              {nutritionist.specialization}
            </p>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div className="pt-2">
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            Rate Your Nutritionist
          </h2>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={26}
                className={`cursor-pointer transition-all duration-150 ${
                  rating && rating >= star
                    ? "text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
                onClick={() => handleRating(star)}
                role="button"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyNutritionist;
