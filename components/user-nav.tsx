"use client";

import { useState, useEffect, useRef } from "react";
import { User, LogOut, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";

interface UserNavProps {
  user: Session["user"];
}

export function UserNav({ user }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg hover:bg-secondary px-2 py-1.5 transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        )}
        <span className="text-sm font-medium hidden sm:inline">
          {user.name}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-background shadow-lg">
          <div className="p-3 border-b">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
                <Shield className="h-3 w-3" />
                Admin
              </span>
            )}
          </div>

          <div className="p-1">
            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
              >
                <Settings className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}

            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
