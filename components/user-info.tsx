import type { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4 ">
        <div className="flex flex-row justify-between items-center rounded p-3 shadow-md">
          <p className="text-sm">ID</p>
          <p className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
            {user?.id}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center rounded p-3 shadow-md">
          <p className="text-sm">Name</p>
          <p className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
            {user?.name}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center rounded p-3 shadow-md">
          <p className="text-sm">Email</p>
          <p className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center rounded p-3 shadow-md">
          <p className="text-sm">Role</p>
          <p className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
            {user?.role}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center rounded p-3 shadow-md">
          <p className="text-sm">Two factor authentication</p>
          {/* <p className="truncate text-sm max-w-[180px] p-1 bg-slate-100 rounded-md">
         </p> */}

          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
