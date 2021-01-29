import { User } from "discord.js";
import Session from "./session";

// TODO: Consider using a set for sessions. Maybe a dictionary would be better with users as keys. A session could have multiple entries under each user's key.
let sessions: Session[] = [];

const removeFromSessions = (participants: Set<User>) => {
  sessions = sessions.filter(session => {
    // Remove participants from any sessions they're currently in.
    session.removeParticipants(participants);
    if (session.participants.size === 0) {
      // End and remove any session with no participants.
      session.end();
      return false;
    }
    return true;
  });
};

export const sessionStatuses = (): Session[] => sessions;
export const sessionLength = (): number => sessions.length;

export const startSession = (newSession: Session): void => {
  removeFromSessions(newSession.participants);
  sessions.push(newSession);
};

export const clearSessions = (): void => {
  sessions.forEach(session => session.end());
  sessions = [];
};

export const flipSessions = (): void => {
  sessions.forEach(session => session.flip());
};

export const leaveSessions = (participant: User): void => {
  removeFromSessions(new Set([participant]));
};

export const joinSession = (participant: User, targetUser: User): boolean => {
  // TODO: Remove and add in one loop.
  removeFromSessions(new Set([participant]));
  const targetSession = sessions.find(session => session.participants.has(targetUser));
  if (targetSession) {
    targetSession.participants.add(participant);
    return true;
  }
  return false;
};
