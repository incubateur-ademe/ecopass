import { prismaClient } from "./prismaClient";

export const createUpload = async () => {
  return prismaClient.upload.create({select: { id: true }});
};
