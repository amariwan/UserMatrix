import { jest } from "@jest/globals";
import { PrismaClient } from "@prisma/client";

const mockPrismaClient = {
  application: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

export const prismaClient = mockPrismaClient as unknown as PrismaClient;
