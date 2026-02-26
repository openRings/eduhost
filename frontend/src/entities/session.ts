import { fetchApi } from "../utils/api";

export type Session = {
  access: AccessLevel;
  sessionId: string;
  userId: string;
};

export enum AccessLevel {
  Student = "Student",
  Teacher = "Teacher",
  Admin = "Admin",
}

export async function fetchSession() {
  const { body } = await fetchApi<Session>("/session");

  return body;
}
