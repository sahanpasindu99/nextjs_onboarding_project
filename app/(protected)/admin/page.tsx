"use client";
import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
const onServerActionClick=()=>{
  admin()
  .then((data)=>{
    if(data.success){
      toast.success(data.success);
    }
    if(data.error){
      toast.error(data.error);
    }
  })
}

  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("Allowed");
      } else {
        toast.error("Forbidden");
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        <div className="flex items-center justify-between rounded-md shadow-md border p-3">
          <p className="text-sm font-medium">ADMIN-Only API route</p>
          <button
            className="bg-black text-white p-2 border rounded-md"
            onClick={onApiRouteClick}
          >
            Click to test
          </button>
        </div>
        <div className="flex  items-center justify-between rounded-md shadow-md border p-3">
          <p className="text-sm font-medium">ADMIN-Only Server action </p>
          <button onClick={onServerActionClick} className="bg-black text-white p-2 border rounded-md">
            Click to test
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
