import { User } from "discord.js";
import Session from "./session";

// TODO: Consider using a set for sessions. Maybe a dictionary would be better with users as keys. A session could have multiple entries under each user's key.
const sessions: Map<User, Session> = new Map<User, Session>();

const removeFromSessions = (participants: Set<User>) => {
  participants.forEach(user => {
    const userSession = sessions.get(user);
    userSession?.removeParticipants(new Set([user]));
    sessions.delete(user);
  });
};

export const getSession = (user: User): Session => sessions.get(user);
export const sessionStatuses = (): Set<Session> => new Set(sessions.values());
export const sessionLength = (): number => sessions.size;

export const startSession = (newSession: Session): void => {
  removeFromSessions(newSession.participants);
  newSession.participants.forEach(user => sessions.set(user, newSession));
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
  const targetSession = sessions.get(targetUser);
  if (targetSession) {
    targetSession.participants.add(participant);
    return true;
  }
  return false;
};
