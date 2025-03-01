"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";

// export function NavUser(

// ) {
//   const { isMobile } = useSidebar()
//   const { user, logout } = useAuth();
//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//             >
//               <Avatar className="h-8 w-8 rounded-lg">
//                 <AvatarImage src={user?.photoURL} alt={user.displayName} />
//                 <AvatarFallback className="rounded-lg">CN</AvatarFallback>
//               </Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-semibold">{user?.displayName}</span>
//                 {/* <span className="truncate text-xs">{user?.email}</span> */}
//               </div>
//               <ChevronsUpDown className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage src={user?.photoURL} alt=" " />
//                   {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
//                 </Avatar>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">{user?.displayName}</span>
//                   <span className="truncate text-xs">{user?.email}</span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <Sparkles />
//                 Upgrade to Pro
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <BadgeCheck />
//                 Account
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <CreditCard />
//                 Billing
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Bell />
//                 Notifications
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//                 <Button
//                   onClick={logout}
//                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                 >
//                   Logout
//                 </Button>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }
// export function NavUser() {
//   const { isMobile } = useSidebar();
//   const { user, logout } = useAuth();

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton size="lg">
//               <Avatar className="h-10 w-10 ring-2 ring-blue-500/10">
//                 <AvatarImage
//                   src={user?.photoURL}
//                   alt={user?.displayName}
//                   className="object-cover"
//                 />
//                 <AvatarFallback className="bg-blue-500 text-white">
//                   {user?.displayName?.charAt(0)}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight ml-3">
//                 <span className="font-semibold text-gray-900">
//                   {user?.displayName}
//                 </span>
//                 <span className="text-xs text-gray-500">{user?.email}</span>
//               </div>
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-72 rounded-xl shadow-lg border border-gray-100"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={8}
//           >
//             <DropdownMenuLabel className="p-4">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-12 w-12 ring-2 ring-blue-500/10">
//                   <AvatarImage src={user?.photoURL} alt={user?.displayName} />
//                   <AvatarFallback>
//                     {user?.displayName?.charAt(0)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div className="grid flex-1">
//                   <span className="font-semibold text-gray-900">
//                     {user?.displayName}
//                   </span>
//                   <span className="text-sm text-gray-500">{user?.email}</span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator className="bg-gray-100" />
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <Sparkles className="mr-3 h-5 w-5 text-blue-500" />
//                 Upgrade to Pro
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <BadgeCheck />
//                 Account
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <CreditCard />
//                 Billing
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Bell />
//                 Notifications
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//               <Button
//                 onClick={logout}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 <LogOut />
//                 Sign Out
//               </Button>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }
// Updated NavUser with consistent styling
export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <div className="p-4 border-t border-gray-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center space-x-3 p-2 hover:bg-gray-800/50 rounded-xl">
            <Avatar className="h-10 w-10 ring-2 ring-violet-500/10">
              <AvatarImage
                src={user?.photoURL}
                alt={user?.displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-700 text-white">
                {user?.displayName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
              <span className="font-semibold text-gray-100 truncate">{user?.displayName}</span>
              <span className="text-gray-400 text-xs truncate">{user?.email}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-72 bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-xl shadow-xl"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 ring-2 ring-violet-500/10">
                <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-700 text-white">
                  {user?.displayName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1">
                <span className="font-semibold text-gray-100">{user?.displayName}</span>
                <span className="text-sm text-gray-400">{user?.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-3 hover:bg-gray-800/50 focus:bg-gray-800/50">
              <Sparkles className="mr-3 h-5 w-5 text-violet-500" />
              <span className="text-gray-100">Upgrade to Pro</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-3 hover:bg-gray-800/50 focus:bg-gray-800/50">
              <BadgeCheck className="mr-3 h-5 w-5 text-gray-400" />
              <span className="text-gray-100">Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 hover:bg-gray-800/50 focus:bg-gray-800/50">
              <CreditCard className="mr-3 h-5 w-5 text-gray-400" />
              <span className="text-gray-100">Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 hover:bg-gray-800/50 focus:bg-gray-800/50">
              <Bell className="mr-3 h-5 w-5 text-gray-400" />
              <span className="text-gray-100">Notifications</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem className="p-3">
            <Button
              onClick={logout}
              className="w-full p-2 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}