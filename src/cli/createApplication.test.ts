import { jest } from "@jest/globals";
import { createApplication } from "./createApplication";
import { prismaClient } from "@prisma/client";
import consola from "consola";

// Mock für consola
jest.mock("consola", () => ({
  start: jest.fn(),
  success: jest.fn(),
}));

const defaultAppData = {
  id: "app_1",
  name: "Test App",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("createApplication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return existing application if found", async () => {
    prismaClient.application.findFirst.mockResolvedValue(defaultAppData);

    const result = await createApplication();

    expect(prismaClient.application.findFirst).toHaveBeenCalled();
    expect(prismaClient.application.create).not.toHaveBeenCalled();
    expect(result).toEqual(defaultAppData);
    expect(consola.start).toHaveBeenCalledWith("Checking for existing application...");
  });

  it("should create and return application if not found", async () => {
    prismaClient.application.findFirst.mockResolvedValue(null);
    prismaClient.application.create.mockResolvedValue(defaultAppData);

    const result = await createApplication();

    expect(prismaClient.application.findFirst).toHaveBeenCalled();
    expect(prismaClient.application.create).toHaveBeenCalledWith({
      data: { name: "Test App" },
    });
    expect(result).toEqual(defaultAppData);
    expect(consola.start).toHaveBeenCalledWith("Checking for existing application...");
    expect(consola.success).toHaveBeenCalledWith("Application created successfully");
  });

  it("should call consola.start at the beginning", async () => {
    prismaClient.application.findFirst.mockResolvedValue(defaultAppData);

    await createApplication();

    expect(consola.start).toHaveBeenCalledWith("Checking for existing application...");
    expect(prismaClient.application.findFirst).toHaveBeenCalled();
  });
});
