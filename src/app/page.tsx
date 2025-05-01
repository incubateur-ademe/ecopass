import { StartDsfrOnHydration } from "../dsfr-bootstrap";
import Home from "../views/Home";

export default function HomePage() {
  return (
    <>
      <StartDsfrOnHydration />
      <Home />
    </>
  );
}
