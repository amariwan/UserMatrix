import createAdminRole from "./createAdminRole";

jest.mock("consola", () => ({
  start: jest.fn(),
  success: jest.fn(),
}));
import consola from "consola";

const mockFindFirst = jest.fn();
const mockCreate = jest.fn();

jest.mock("@/config/database", () => ({
  default: {
    role: {
      findFirst: mockFindFirst,
      create: mockCreate,
    },
  },
}));

describe("createAdminRole", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not create role if it already exists", async () => {
    mockFindFirst.mockResolvedValue({ id: 1, name: "Admin" });
    await createAdminRole();
    expect(mockFindFirst).toHaveBeenCalledWith({ where: { name: "Admin" } });
    expect(mockCreate).not.toHaveBeenCalled();
    expect(consola.start).toHaveBeenCalledWith("Creating admin role...");
    expect(consola.success).toHaveBeenCalledWith("Admin role created!");
  });

  it("should create role if it does not exist", async () => {
    mockFindFirst.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: 2, name: "Admin" });
    await createAdminRole();
    expect(mockFindFirst).toHaveBeenCalledWith({ where: { name: "Admin" } });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: "Admin",
        description:
          "Admins have access to advanced features, configuration settings, and management capabilities, allowing them to oversee and control various aspects of the API server. This role is crucial for system administration, ensuring the proper functioning, security, and maintenance of the API infrastructure.",
      },
    });
    expect(consola.start).toHaveBeenCalledWith("Creating admin role...");
    expect(consola.success).toHaveBeenCalledWith("Admin role created!");
  });
});
