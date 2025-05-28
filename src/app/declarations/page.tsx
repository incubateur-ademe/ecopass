import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import Declarations from "../../views/Declarations"

const DeclarationsPage = ({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) => {
  const page = searchParams?.page ? parseInt(searchParams.page as string, 10) : 1
  return (
    <>
      <StartDsfrOnHydration />
      <Declarations page={page} />
    </>
  )
}

export default DeclarationsPage
