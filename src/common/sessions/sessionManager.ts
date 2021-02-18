import { User } from "discord.js";
import Session from "./session";

const sessions: Map<string, Session> = new Map();

const removeFromSessions = (participants: Map<string, User> | User[] | User) => {
  if ("id" in participants) {
    participants = [participants];
  }

  participants.forEach((user: User) => {
    const userSession = sessions.get(user.id);
    userSession?.removeParticipants(user);
    if (userSession?.participants.size === 0) userSession?.end();
    sessions.delete(user.id);
  });
};

// #region Session getters
export const getSession = (user: User): Session => sessions.get(user.id);
export const sessionStatuses = (): Set<Session> => new Set(sessions.values());
export const sessionLength = (): number => sessions.size;
// #endregion

export const startSession = (newSession: Session): void => {
  removeFromSessions(newSession.participants);
  newSession.participants.forEach(user => sessions.set(user.id, newSession));
};

export const clearSessions = (): void => {
  sessions.forEach(session => session.end());
  sessions.clear();
};

export const leaveSessions = (participant: User): void => {
  removeFromSessions(participant);
};

export const joinSession = (participant: User, target: User | Session): boolean => {
  removeFromSessions(participant);
  const targetSession = "id" in target ? sessions.get(target.id) : target;
  if (targetSession) {
    targetSession.addParticipants(participant);
    sessions.set(participant.id, targetSession);
    return true;
  }
  return false;
};

export const flipSessions = (): void => {
  sessions.forEach(session => session.flip());
};
