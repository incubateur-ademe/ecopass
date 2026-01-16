import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Documentation from "../../views/Documentation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation - Affichage environnemental",
}

const DocumentationPage = () => {
  console.log("[MEMORY][documentation/page][start]", process.memoryUsage())
  const result = (
    <>
      <StartDsfrOnHydration />
      <Documentation />
    </>
  )
  console.log("[MEMORY][documentation/page][end]", process.memoryUsage())
  return result
}

export default DocumentationPage
