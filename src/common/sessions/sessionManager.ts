import { User } from "discord.js";
import WorkSession from "./workSession";

type Target = User | WorkSession;

const sessions: Map<string, WorkSession> = new Map();

const removeFromSessions = (users: Map<string, User> | User[] | User) => {
  if ("id" in users) {
    users = [users];
  }

  users.forEach(leaveSession);
};

export const getSession = (target: Target): WorkSession => {
  return "id" in target ? sessions.get(target.id) : target;
};

export const startSession = (newSession: WorkSession): void => {
  removeFromSessions(newSession.users);
  newSession.users.forEach(user => sessions.set(user.id, newSession));
};

export const updateSession = (target: Target, workMinutes: number, breakMinutes: number): boolean => {
  const session = getSession(target);
  if (!session) return false;

  session.update({ workMinutes, breakMinutes });
  return true;
};

export const leaveSession = (user: User): boolean => {
  const userSession = sessions.get(user.id);
  if (!userSession) return false;

  userSession.removeUsers(user);
  sessions.delete(user.id);
  if (userSession.users.size === 0) userSession.end();
  return true;
};

export const joinSession = (user: User, target: Target): boolean => {
  removeFromSessions(user);
  const targetSession = getSession(target);
  if (!targetSession) return false;

  targetSession.addUsers(user);
  sessions.set(user.id, targetSession);
  return true;
};

export const flipSession = (target: Target): boolean => {
  const session = getSession(target);
  if (!session) return false;

  session.flip();
  return true;
};

export const pauseSession = (target: Target): boolean => {
  const targetSession = getSession(target);
  if (!targetSession) return false;

  targetSession.pause();
  return true;
};

export const unpauseSession = (target: Target): boolean => {
  const targetSession = getSession(target);
  if (!targetSession) return false;

  targetSession.unpause();
  return true;
};
