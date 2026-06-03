import Block from "../components/Block/Block"
import ResetPasswordForm from "../components/Login/ResetPasswordForm"

const ResetPassword = ({ token }: { token: string }) => {
  return (
    <Block className='fr-grid-row fr-grid-row--center'>
      <ResetPasswordForm token={token} />
    </Block>
  )
}

export default ResetPassword
