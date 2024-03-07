"use client";
import UserInfo from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { currentUser } from "@/lib/auth";
import React from "react";

const ServerPage = () => {
  const user = useCurrentUser();
  return <UserInfo user={user} label="💻 Client Component" />;
};

export default ServerPage;
