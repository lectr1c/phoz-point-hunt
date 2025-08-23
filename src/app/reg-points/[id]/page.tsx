import RegisterPointsForm from "~/features/points/components/RegPointsForm";
import FreshUserInit from "~/features/points/components/FreshUserInit";

export default async function RegisterPoints({ params } : { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  return (
      <RegisterPointsForm params={resolvedParams}><FreshUserInit/></RegisterPointsForm>
  );
}