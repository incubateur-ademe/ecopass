import { redirect } from "next/navigation"
import { auth } from "../../services/auth/auth"
import { getUserByEmail } from "../../db/user"

const ProfilePage = async () => {
  const session = await auth()
  if (!session || !session.user) {
    redirect("/")
  }
  const user = await getUserByEmail(session.user.email)
  return <div>{user?.apiKey}</div>
}

export default ProfilePage
