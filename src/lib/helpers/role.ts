import { UserType } from "../db/schemas/auth-schema";

export type Roles = "admin" | "user";
type Role = {
  name: string;
  uploadLimit: number;
};

export const roles: Record<Roles, Role> = {
  admin: {
    name: "Admin",
    uploadLimit: -1,
  },
  user: {
    name: "User",
    uploadLimit: 8388608, // 8MB
  },
};

/**
 * Gets the role for a user.
 *
 * @param user the user to get the role for
 * @returns the user's role
 */
export function getUserRole(user: UserType): Role {
  let role = user.role as Roles;
  if (!role) {
    role = "user"; // the default role
  }
  return roles[role];
}

/**
 * Checks if a user has a specific role.
 *
 * @param user the user to check
 * @param role the role to check for
 * @returns true if the user has the role, false otherwise
 */
export function hasUserRole(user: UserType, role: Roles): boolean {
  return getUserRole(user) === roles[role];
}

/**
 * Checks if a role is valid.
 *
 * @param role the role to check
 * @returns returns true if the role is a valid role, false otherwise
 */
export function roleExists(role: Roles): boolean {
  return roles[role] !== undefined;
}
