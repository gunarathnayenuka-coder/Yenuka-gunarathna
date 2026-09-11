import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, UserCog } from "lucide-react";
import type { Role, User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime, initials } from "@/lib/format";
import { ROLE_LABELS } from "@/lib/labels";

export interface UserColumnsContext {
  currentUserId: string;
  rolesById: Record<string, Role>;
  onChangeRole: (user: User) => void;
  onRequestRemove: (user: User) => void;
}

/** Column defs for the Users & Roles DataTable. `ctx` carries the row-action callbacks wired up in the client wrapper. */
export function buildUserColumns(ctx: UserColumnsContext): ColumnDef<User>[] {
  return [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2.5 font-medium">
            <Avatar className="size-7">
              <AvatarFallback className="text-[10px]">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate">{user.name}</p>
              {user.id === ctx.currentUserId && <p className="text-xs font-normal text-muted-foreground">You</p>}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
    },
    {
      id: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="secondary">{ROLE_LABELS[ctx.rolesById[row.original.id]]}</Badge>,
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last active",
      cell: ({ row }) => <span className="text-muted-foreground">{formatRelativeTime(row.original.lastActiveAt)}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = user.id === ctx.currentUserId;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${user.name}`} />}>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => ctx.onChangeRole(user)}>
                <UserCog /> Change role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                disabled={isSelf}
                onClick={() => ctx.onRequestRemove(user)}
              >
                <Trash2 /> Remove user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
