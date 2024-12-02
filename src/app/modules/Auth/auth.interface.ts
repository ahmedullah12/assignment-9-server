import { UserRole } from "@prisma/client";

export interface ISignUpPayload {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  role: UserRole;
  profileImage?: string;
}

