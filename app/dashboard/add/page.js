import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: "Add subscription | Renwize",
  description: "Add a new subscription to track in Renwize.",
};

export default async function AddSubscriptionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth");
  }

  redirect("/dashboard?section=subscriptions&modal=add");
}
