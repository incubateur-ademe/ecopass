import { StartDsfrOnHydration } from "../dsfr-bootstrap";
import Home from "../pages/Home";

export default function HomePage() {
  return (
    <>
      <StartDsfrOnHydration />
      <Home />
    </>
  );
}
