import RegisterPointsForm from "~/app/reg-points/_components/RegPointsForm";
import FreshUserInit from "~/app/reg-points/_components/FreshUserInit";

export default function RegisterPoints({ params } : { params: { id: string } }) {

  return (
      <RegisterPointsForm params={params}><FreshUserInit/></RegisterPointsForm>
  );
}