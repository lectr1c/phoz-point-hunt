import RegisterPointsForm from "~/app/reg-points/_components/RegPointsForm";
import FreshUserInit from "~/app/reg-points/_components/FreshUserInit";

export default function RegisterPoints() {

    return (
        <RegisterPointsForm params={{ id: ""}}><FreshUserInit/></RegisterPointsForm>
    );
}