import Button, { ButtonProps } from "@codegouvfr/react-dsfr/Button"
import LoadingIcon from "./Loading"

const LoadingButton = ({
  loading,
  children,
  nativeButtonProps,
  disabled,
  ...rest
}: { loading: boolean } & ButtonProps) => {
  return (
    <Button
      {...rest}
      disabled={disabled || loading}
      nativeButtonProps={{ disabled: loading, ...nativeButtonProps }}
      linkProps={undefined}>
      {children} {loading && <LoadingIcon />}
    </Button>
  )
}

export default LoadingButton
