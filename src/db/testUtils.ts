import { prismaTest } from "../../jest.setup"

export const cleanDB = async () => {
  await prismaTest.score.deleteMany()
  await prismaTest.accessory.deleteMany()
  await prismaTest.material.deleteMany()
  await prismaTest.uploadProduct.deleteMany()
  await prismaTest.product.deleteMany()
  await prismaTest.upload.deleteMany()
  await prismaTest.export.deleteMany()
  await prismaTest.authorizedOrganization.deleteMany()
  await prismaTest.aPIKey.deleteMany()
  await prismaTest.user.deleteMany()
  await prismaTest.brand.deleteMany()
  await prismaTest.organization.deleteMany()
}
