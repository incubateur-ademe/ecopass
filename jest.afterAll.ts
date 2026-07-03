import { prismaTest } from "./jest.setup"

const afterAll = async () => {
  await prismaTest.$disconnect()
}

export default afterAll
