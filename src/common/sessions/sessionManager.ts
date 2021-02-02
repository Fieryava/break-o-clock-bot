import { User } from "discord.js";
import Session from "./session";

const sessions: Map<string, Session> = new Map();

const removeFromSessions = (participants: Set<User>) => {
  participants.forEach(user => {
    const userSession = sessions.get(user.id);
    userSession?.removeParticipants(new Set([user]));
    if (userSession?.participants.size === 0) userSession?.end();
    sessions.delete(user.id);
  });
};

export const getSession = (user: User): Session => sessions.get(user.id);
export const sessionStatuses = (): Set<Session> => new Set(sessions.values());
export const sessionLength = (): number => sessions.size;

export const startSession = (newSession: Session): void => {
  removeFromSessions(newSession.participants);
  newSession.participants.forEach(user => sessions.set(user.id, newSession));
};

export const clearSessions = (): void => {
  sessions.forEach(session => session.end());
  sessions.clear();
};

export const flipSessions = (): void => {
  sessions.forEach(session => session.flip());
};

export const leaveSessions = (participant: User): void => {
  removeFromSessions(new Set([participant]));
};

export const joinSession = (participant: User, targetUser: User): boolean => {
  removeFromSessions(new Set([participant]));
  const targetSession = sessions.get(targetUser.id);
  if (targetSession) {
    targetSession.participants.add(participant);
    return true;
  }
  return false;
};
