import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Reena",
    role: "Nutritionist",
    content:
      "This platform has revolutionized how I manage my clients. The dashboard provides all the information I need at a glance.",
  },
  {
    name: "Preethi",
    role: "Client",
    content:
      "Working with my nutritionist through this platform has been seamless. I can easily track my progress and communicate with my nutritionist.",
  },
  {
    name: "Madhusudan",
    role: "Admin",
    content:
      "Managing our team of nutritionists and their clients has never been easier. The role-based access control is exceptional.",
  },
  {
    name: "Shiva",
    role: "Nutritionist",
    content:
      "The analytics tools are fantastic. I can track client progress in real-time and adjust plans accordingly.",
  },
  {
    name: "Venkata Bhaskar",
    role: "Client",
    content:
      "The app is user-friendly, and I love the personalized meal plans my nutritionist creates for me.",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  name,
  role,
  content,
}: {
  name: string;
  role: string;
  content: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-col">
        <figcaption className="text-sm font-medium dark:text-white">
          {name}
        </figcaption>
        <p className="text-xs font-medium dark:text-white/40">{role}</p>
      </div>
      <blockquote className="mt-2 text-sm">{content}</blockquote>
    </figure>
  );
};

export default function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full" />
    </div>
  );
}