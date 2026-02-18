import { StartDsfrOnHydration } from "@codegouvfr/react-dsfr/next-app-router"
import { Metadata } from "next"
import Block from "../../../components/Block/Block"
import CreateUserForm from "../../../components/Admin/CreateUserForm"
import { tryAndGetSession } from "../../../services/auth/redirect"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/enums"

export const metadata: Metadata = {
  title: "Créer un utilisateur - Affichage environnemental",
}

const CreateUserPage = async () => {
  const session = await tryAndGetSession(true, true)
  if (session.user.role !== UserRole.ADMIN) {
    return redirect("/")
  }

  return (
    <>
      <StartDsfrOnHydration />
      <Block>
        <h1>Créer un nouvel utilisateur</h1>
        <CreateUserForm />
      </Block>
    </>
  )
}

export default CreateUserPage
