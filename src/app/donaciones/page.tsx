import DonacionesClient from "./DonacionesClient";
import { getPublicConfiguration } from "@/lib/configuracion";

export const metadata = {
  title: "Donaciones",
  description: "Conocé cómo apoyar la acción climática de la Fundación Correntinos.",
};

export default async function DonacionesPage() {
  const configuration = await getPublicConfiguration();
  return <DonacionesClient email={configuration.email} phone={configuration.phone} />;
}
