import { User } from "discord.js";
import Session from "./session";

// TODO: Consider using a set for sessions. Maybe a dictionary would be better with users as keys. A session could have multiple entries under each user's key.
let sessions: Session[] = [];

const removeFromSessions = (participants: User[]) => {
  sessions = sessions.filter(session => {
    // Remove participants from any sessions they're currently in.
    session.removeParticipants(participants);
    if (session.participants.length === 0) {
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
  removeFromSessions([participant]);
};

export const joinSession = (participant: User, target: User): boolean => {
  // TODO: Remove and add in one loop.
  removeFromSessions([participant]);
  const targetSession = sessions.find(session => session.participants.includes(target));
  if (targetSession) {
    targetSession.participants.push(participant);
    return true;
  }
  return false;
};
