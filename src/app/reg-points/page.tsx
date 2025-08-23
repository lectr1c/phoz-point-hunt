import RegisterPointsForm from "~/features/points/components/RegPointsForm";
import FreshUserInit from "~/features/points/components/FreshUserInit";

export default function RegisterPoints() {

    return (
        <RegisterPointsForm params={{ id: ""}}><FreshUserInit/></RegisterPointsForm>
    );
}