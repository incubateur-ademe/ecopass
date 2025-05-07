import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button"
import LoadingIcon from "./Loading"

const LoadingButton = ({ loading, children, nativeButtonProps, ...rest }: { loading: boolean } & ButtonProps) => {
  return (
    <Button {...rest} nativeButtonProps={{ disabled: loading, ...nativeButtonProps }} linkProps={undefined}>
      {children} {loading && <LoadingIcon />}
    </Button>
  )
}

export default LoadingButton
