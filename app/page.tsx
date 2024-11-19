import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

export default function Home() {
  return (
   <main className="flex h-screen flex-col items-center justify-center bg-sky-500">
<div className="space-y-6 text-center">
 <h1 className="font-bold text-3xl text-white">Auth</h1>
 <p className="text-md text-white">Authentication below</p>
<LoginButton >
  <Button variant="secondary" size='lg'>
    Login
  </Button>
</LoginButton>
</div>
   </main>
  );
}
