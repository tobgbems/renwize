import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: "Edit subscription | Renwize",
  description: "Update a subscription in Renwize.",
};

export default async function EditSubscriptionPage({ params }) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/auth");
  }

  const { id } = await params;
  if (!id || typeof id !== "string") {
    redirect("/dashboard?section=subscriptions");
  }

  redirect(`/dashboard?section=subscriptions&modal=edit&id=${id}`);
}
