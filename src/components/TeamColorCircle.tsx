export default function TeamColorCircle({
  mainColor,
  secondaryColor,
}: {
  mainColor: string;
  secondaryColor: string;
}) {
  return (
    <div
      className="radius h-[16px] w-[16px] rounded-2xl outline outline-4"
      style={{
        backgroundColor: mainColor,
        outlineColor: secondaryColor,
      }}
    ></div>
  );
}
