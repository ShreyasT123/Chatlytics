"use client";

import { useAuth } from "@/context/AuthContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { MainChart, AChart, BChart, CChart} from "@/components/Chart";

export function BasicButtons() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
  );
}
export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    // <ProtectedRoute>
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50">
              <AChart />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              <BChart />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              <CChart />
            </div>
          </div>
          <MainChart />

          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <h1>{user?.displayName}</h1>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    // </ProtectedRoute>
  );
}
