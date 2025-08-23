export default function TeamColorCircle({
  mainColor,
  secondaryColor,
  size = "md",
}: {
  mainColor: string;
  secondaryColor: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-2 transition-all duration-150 hover:scale-110 cursor-pointer`}
      style={{
        backgroundColor: mainColor,
        borderColor: secondaryColor,
      }}
    ></div>
  );
}
