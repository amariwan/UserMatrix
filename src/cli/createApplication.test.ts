import consola from "consola";

import prismaClient from "@/config/database";

import createApplication from "./createApplication";

jest.mock("@/config/database");
jest.mock("consola");

const defaultAppData = { name: "Default App" };

describe("createApplication", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return existing application if found", async () => {
    (prismaClient.application.findFirst as jest.Mock).mockResolvedValue(defaultAppData);

    const result = await createApplication();

    expect(prismaClient.application.findFirst).toHaveBeenCalledWith({
      where: { name: defaultAppData.name },
    });
    expect(prismaClient.application.create).not.toHaveBeenCalled();
    expect(consola.success).toHaveBeenCalledWith(`${defaultAppData.name} created!`);
    expect(result).toEqual(defaultAppData);
  });

  it("should create and return application if not found", async () => {
    (prismaClient.application.findFirst as jest.Mock).mockResolvedValue(null);
    (prismaClient.application.create as jest.Mock).mockResolvedValue(defaultAppData);

    const result = await createApplication();

    expect(prismaClient.application.create).toHaveBeenCalledWith({
      data: { name: defaultAppData.name },
    });
    expect(consola.success).toHaveBeenCalledWith(`${defaultAppData.name} created!`);
    expect(result).toEqual(defaultAppData);
  });

  it("should call consola.start at the beginning", async () => {
    (prismaClient.application.findFirst as jest.Mock).mockResolvedValue(defaultAppData);

    await createApplication();

    expect(consola.start).toHaveBeenCalledWith("Creating default application...");
  });
});
