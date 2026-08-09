import { useQuery } from "@tanstack/react-query";
import { skillsService } from "@/services/skillsService";

const SkillUpHeader = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["skillUpStats"],
    queryFn: skillsService.getStats,
  });

  const categories = [
    "Publications",
    "Courses",
    "Industry Events",
    "Technical Data",
    "Legal & Compliance",
    "and many more",
  ];

  return (
    <div className="rounded-xl bg-gradient-to-r from-primary to-primary/90 p-6 text-white">
      {/* Header */}
      <h2 className="mb-2 text-2xl font-bold">
        Resource Hub
      </h2>

      <p className="mb-6 text-primary-100">
        Your One-Stop shop to help stay relevant, manage projects
        efficiently, and ensure compliance.
      </p>

      {/* Category Tags */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-lg bg-primary/70 px-5 py-3 text-center font-medium text-white shadow-sm"
          >
            {category}
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="flex items-center justify-center py-8">
        <h2 className="text-3xl font-bold text-white">
          Coming Soon
        </h2>
      </div>
    </div>
  );
};

export default SkillUpHeader;