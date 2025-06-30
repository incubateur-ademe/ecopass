import bcrypt from "bcrypt"

export const signPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hashSync(password, salt)
}
