"use client"
import { FaUser } from "react-icons/fa"
import { DropdownMenu, DropdownMenuContent,DropdownMenuTrigger,DropdownMenuItem } from "../ui/dropdown-menu"

import { Avatar,AvatarFallback,AvatarImage } from "../ui/avatar"
import useCurrentUser from "@/hooks/use-current-user"
import LogoutButton from "./logout-button"
import { ExitIcon } from "@radix-ui/react-icons"

const UserButton = () => {
    const user=useCurrentUser();
    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""}/>
                    <AvatarFallback className="bg-sky-500">
                        <FaUser className="text-white"/>
                    </AvatarFallback>
                </Avatar>
         
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                    <LogoutButton>
                        <DropdownMenuItem>
                            <ExitIcon className="mr-2 w-4 h-4"/>
                            Logout
                        </DropdownMenuItem>
                    </LogoutButton>
                    </DropdownMenuContent>
        </DropdownMenu>
      );
}
 
export default UserButton;