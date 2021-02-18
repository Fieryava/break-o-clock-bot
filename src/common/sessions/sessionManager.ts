import { User } from "discord.js";
import Session from "./session";

type Target = User | Session;

const sessions: Map<string, Session> = new Map();

const removeFromSessions = (participants: Map<string, User> | User[] | User) => {
  if ("id" in participants) {
    participants = [participants];
  }

  participants.forEach((user: User) => {
    const userSession = sessions.get(user.id);
    if (!userSession) return;

    userSession.removeParticipants(user);
    sessions.delete(user.id);
    if (userSession.participants.size === 0) userSession.end();
  });
};

export const getSession = (target: Target): Session => {
  return "id" in target ? sessions.get(target.id) : target;
};

export const startSession = (newSession: Session): void => {
  removeFromSessions(newSession.participants);
  newSession.participants.forEach(user => sessions.set(user.id, newSession));
};

export const leaveSession = (participant: User): void => {
  removeFromSessions(participant);
};

export const joinSession = (participant: User, target: Target): boolean => {
  removeFromSessions(participant);
  const targetSession = getSession(target);
  if (!targetSession) return false;

  targetSession.addParticipants(participant);
  sessions.set(participant.id, targetSession);
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
