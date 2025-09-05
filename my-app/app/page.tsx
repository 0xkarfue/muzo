import LandingPage from "@/components/Landing";
import { getServerSession } from "next-auth";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
export default async function Home() {

  const session = await getServerSession()

  if (session?.user?.email) {
    // router.push("/dashboard")
    redirect("/dashboard");
  }
  return (
    <div>
      <LandingPage />
    </div>
  );
}
