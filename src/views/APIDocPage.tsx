import SwaggerUI from "swagger-ui-react"
import Block from "../components/Block/Block"

const APIDocPage = ({ spec }: React.ComponentProps<typeof SwaggerUI>) => {
  return (
    <Block noMargin>
      <SwaggerUI spec={spec} supportedSubmitMethods={["get"]} />
    </Block>
  )
}

export default APIDocPage
