import { UserType } from "../db/schemas/auth-schema";

type Roles = "admin" | "user";
type Role = {
  name: string;
};

const roles: Record<Roles, Role> = {
  admin: { name: "Admin" },
  user: { name: "User" },
};

/**
 * Gets the role for a user.
 *
 * @param user the user to get the role for
 * @returns the user's role
 */
export function getUserRole(user: UserType): Role {
  let role = user.role as Roles;
  console.log(user.role);
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
