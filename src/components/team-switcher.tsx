"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"

// Updated TeamSwitcher with consistent styling
export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  return (
    <div className="p-4 border-b border-gray-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center space-x-3 p-2 hover:bg-gray-800/50 rounded-xl">
            <div className="flex aspect-square w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700">
              <activeTeam.logo className="h-5 w-5 text-white" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
              <span className="font-semibold text-gray-100 truncate">{activeTeam.name}</span>
              <span className="text-gray-400 text-xs truncate">{activeTeam.plan}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 bg-gray-900/95 backdrop-blur-lg border border-gray-800 rounded-xl shadow-xl">
          <DropdownMenuLabel className="p-3 text-sm text-gray-400">
            Your Teams
          </DropdownMenuLabel>
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.name}
              onClick={() => setActiveTeam(team)}
              className="p-3 hover:bg-gray-800/50 focus:bg-gray-800/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-700">
                  <team.logo className="h-4 w-4 text-white" />
                </div>
                <div className="grid flex-1">
                  <span className="font-medium text-gray-100">{team.name}</span>
                  <span className="text-xs text-gray-400">{team.plan}</span>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem className="p-3 hover:bg-gray-800/50 focus:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-dashed border-gray-700">
                <Plus className="h-4 w-4 text-gray-400" />
              </div>
              <span className="font-medium text-gray-300">Create New Team</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}