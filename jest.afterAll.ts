import { prismaTest, pool } from "./jest.setup"

const afterAll = async () => {
  await prismaTest.$disconnect()
  await pool.end()
}

export default afterAll
