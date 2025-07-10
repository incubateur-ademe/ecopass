import { prismaTest } from "./jest.setup"

const beforeAll = async () => {
  await prismaTest.$connect()
}

export default beforeAll
