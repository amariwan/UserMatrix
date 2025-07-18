import consola from "consola";

import prismaClient from "@/config/database";

type Application = Awaited<ReturnType<typeof prismaClient.application.findFirst>>;

const defaultApplication = {
  name: "Default App",
};

export default async function createApplication(): Promise<Application | null> {
  consola.start("Creating default application...");

  let defaultApp = await prismaClient.application.findFirst({
    where: {
      name: defaultApplication.name,
    },
  });

  if (!defaultApp) {
    defaultApp = await prismaClient.application.create({
      data: {
        name: defaultApplication.name,
      },
    });
  }
  consola.success(`${defaultApp.name} created!`);

  return defaultApp;
}
