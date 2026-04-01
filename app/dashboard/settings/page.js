import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings | Renwize",
  description: "Update your Renwize profile settings.",
};

export default async function DashboardSettingsPage() {
  redirect("/dashboard?section=settings");
}
