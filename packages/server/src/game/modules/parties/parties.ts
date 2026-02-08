import { PlayerModel } from "../../../database/models/player.model";
import { GameRoom } from "../../../rooms/gameRoom";
import { Player } from "../../player/player";

// --- Party Invite Types & Store ---

export interface PartyInvite {
  inviterId: string;
  inviterUsername: string;
  partyId: string;
  timestamp: number;
}

/** In-memory store of pending invites. Key = target player ID. */
const pendingInvites = new Map<string, PartyInvite[]>();

/** Invites expire after 60 seconds */
const INVITE_EXPIRY_MS = 60 * 1000;

// --- Helper Functions ---

/**
 * Find a player by username in the game room
 */
export const findPlayerByUsername = (
  gameRoom: GameRoom,
  username: string
): Player | null => {
  for (const player of gameRoom.state.players.values()) {
    if (player.username.toLowerCase() === username.toLowerCase()) {
      return player;
    }
  }
  return null;
};

/**
 * Get all players in the same party
 */
export const getPartyMembers = (
  gameRoom: GameRoom,
  partyId: string
): Player[] => {
  return Array.from(gameRoom.state.players.values()).filter(
    (player) => player.party === partyId
  );
};

/**
 * Send a message to a specific player's client
 */
export const sendMessageToPlayer = (
  gameRoom: GameRoom,
  player: Player,
  message: string
): void => {
  const client = gameRoom.clients.find((c) => c.auth.id === player.id);
  if (client) {
    client.send("chat", {
      content: message,
      sender: "SYSTEM",
      type: "system",
    });
  }
};

// --- Invite Helpers ---

/**
 * Remove expired invites for a player
 */
const pruneExpiredInvites = (playerId: string): void => {
  const invites = pendingInvites.get(playerId);
  if (!invites) return;

  const now = Date.now();
  const valid = invites.filter((inv) => now - inv.timestamp < INVITE_EXPIRY_MS);

  if (valid.length === 0) {
    pendingInvites.delete(playerId);
  } else {
    pendingInvites.set(playerId, valid);
  }
};

/**
 * Send the current pending invites list to a player's client
 * via a dedicated "party-invites" message so the UI can render them.
 */
export const sendPendingInvites = (
  gameRoom: GameRoom,
  player: Player
): void => {
  pruneExpiredInvites(player.id);
  const invites = pendingInvites.get(player.id) || [];
  const client = gameRoom.clients.find((c) => c.auth.id === player.id);
  if (client) {
    client.send("party-invites", invites);
  }
};

/**
 * Get pending invites for a player (after pruning expired ones)
 */
export const getPendingInvites = (playerId: string): PartyInvite[] => {
  pruneExpiredInvites(playerId);
  return pendingInvites.get(playerId) || [];
};

/**
 * Remove all invites sent by a specific player (e.g. when they disband or go offline)
 */
export const removeInvitesByInviter = (inviterId: string): void => {
  for (const [targetId, invites] of pendingInvites.entries()) {
    const filtered = invites.filter((inv) => inv.inviterId !== inviterId);
    if (filtered.length === 0) {
      pendingInvites.delete(targetId);
    } else {
      pendingInvites.set(targetId, filtered);
    }
  }
};

/**
 * Remove all pending invites for a player (both received and sent).
 * Call this when a player goes offline.
 */
export const clearInvitesForPlayer = (playerId: string): void => {
  pendingInvites.delete(playerId);
  removeInvitesByInviter(playerId);
};

// --- Party Actions ---

/**
 * Invite a player to join your party.
 * Only the party owner (partyId === their own id) can invite.
 */
export const inviteToParty = async (
  gameRoom: GameRoom,
  inviter: Player,
  targetUsername: string
): Promise<{ success: boolean; message: string }> => {
  // Only the party owner can invite
  if (inviter.party !== inviter.id) {
    console.log(inviter.party, inviter.id)
    return {
      success: false,
      message: "Only the party owner can invite other players.",
    };
  }

  // Find the target player
  const targetPlayer = findPlayerByUsername(gameRoom, targetUsername);

  if (!targetPlayer) {
    return {
      success: false,
      message: `Player "${targetUsername}" not found.`,
    };
  }

  if (targetPlayer.id === inviter.id) {
    return {
      success: false,
      message: "You cannot invite yourself to a party.",
    };
  }

  // Check if target is already in the same party
  if (targetPlayer.party === inviter.party) {
    return {
      success: false,
      message: `${targetPlayer.username} is already in your party.`,
    };
  }

  // Check for duplicate pending invite from the same party
  pruneExpiredInvites(targetPlayer.id);
  const existing = pendingInvites.get(targetPlayer.id) || [];
  if (existing.some((inv) => inv.partyId === inviter.party)) {
    return {
      success: false,
      message: `${targetPlayer.username} already has a pending invite from your party.`,
    };
  }

  // Store the invite
  const invite: PartyInvite = {
    inviterId: inviter.id,
    inviterUsername: inviter.username,
    partyId: inviter.party,
    timestamp: Date.now(),
  };

  existing.push(invite);
  pendingInvites.set(targetPlayer.id, existing);

  // Notify target via chat
  sendMessageToPlayer(
    gameRoom,
    targetPlayer,
    `${inviter.username} has invited you to join their party.`
  );

  // Send updated invite list to the target client so the UI can display it
  sendPendingInvites(gameRoom, targetPlayer);

  return {
    success: true,
    message: `Invitation sent to ${targetPlayer.username}.`,
  };
};

/**
 * Decline a party invite from a specific player
 */
export const declineInvite = (
  gameRoom: GameRoom,
  player: Player,
  inviterUsername: string
): { success: boolean; message: string } => {
  pruneExpiredInvites(player.id);
  const invites = pendingInvites.get(player.id) || [];

  const index = invites.findIndex(
    (inv) => inv.inviterUsername.toLowerCase() === inviterUsername.toLowerCase()
  );

  if (index === -1) {
    return {
      success: false,
      message: `No pending invite from "${inviterUsername}".`,
    };
  }

  const declined = invites.splice(index, 1)[0];

  if (invites.length === 0) {
    pendingInvites.delete(player.id);
  } else {
    pendingInvites.set(player.id, invites);
  }

  // Notify the inviter
  const inviterPlayer = findPlayerByUsername(gameRoom, declined.inviterUsername);
  if (inviterPlayer) {
    sendMessageToPlayer(
      gameRoom,
      inviterPlayer,
      `${player.username} has declined your party invite.`
    );
  }

  // Send updated invite list to the declining player
  sendPendingInvites(gameRoom, player);

  return {
    success: true,
    message: `You declined the party invite from ${declined.inviterUsername}.`,
  };
};

/**
 * Join another player's party.
 * Requires a pending invite from that player's party.
 */
export const joinParty = async (
  gameRoom: GameRoom,
  joiner: Player,
  targetUsername: string
): Promise<{ success: boolean; message: string }> => {
  // Find the target player
  const targetPlayer = findPlayerByUsername(gameRoom, targetUsername);

  if (!targetPlayer) {
    return {
      success: false,
      message: `Player "${targetUsername}" not found.`,
    };
  }

  if (targetPlayer.id === joiner.id) {
    return {
      success: false,
      message: "You are already in your own party.",
    };
  }

  // Check if already in the same party
  if (joiner.party === targetPlayer.party) {
    return {
      success: false,
      message: `You are already in ${targetPlayer.username}'s party.`,
    };
  }

  // Require a pending invite from the target's party
  pruneExpiredInvites(joiner.id);
  const invites = pendingInvites.get(joiner.id) || [];
  const inviteIndex = invites.findIndex(
    (inv) => inv.partyId === targetPlayer.party
  );

  if (inviteIndex === -1) {
    return {
      success: false,
      message: `You don't have an invite to ${targetPlayer.username}'s party.`,
    };
  }

  // Check if the joiner is in their own party and has other members in it
  if (joiner.party === joiner.id) {
    const ownPartyMembers = getPartyMembers(gameRoom, joiner.id);
    if (ownPartyMembers.length > 1) {
      return {
        success: false,
        message:
          "You must disband your current party before joining another. Use /disband to leave your party.",
      };
    }
  }

  // Remove the used invite
  invites.splice(inviteIndex, 1);
  if (invites.length === 0) {
    pendingInvites.delete(joiner.id);
  } else {
    pendingInvites.set(joiner.id, invites);
  }

  const newPartyId = targetPlayer.party;

  // Update joiner's party
  joiner.party = newPartyId;

  // Save to database
  await PlayerModel.findByIdAndUpdate(joiner.id, { party: newPartyId });

  // Notify party members
  const partyMembers = getPartyMembers(gameRoom, newPartyId);
  for (const member of partyMembers) {
    if (member.id !== joiner.id) {
      sendMessageToPlayer(
        gameRoom,
        member,
        `${joiner.username} has joined the party.`
      );
    }
  }

  sendMessageToPlayer(
    gameRoom,
    joiner,
    `You have joined ${targetPlayer.username}'s party.`
  );

  // Send updated invite list to the joiner
  sendPendingInvites(gameRoom, joiner);

  return {
    success: true,
    message: `You have joined ${targetPlayer.username}'s party.`,
  };
};

/**
 * Leave the current party (for non-owner members).
 * Sets the player's party back to their own id.
 */
export const leaveParty = async (
  gameRoom: GameRoom,
  player: Player
): Promise<{ success: boolean; message: string }> => {
  // Check if player is already in their own party
  if (player.party === player.id) {
    return {
      success: false,
      message: "You are not in anyone else's party.",
    };
  }

  // Owners must use /disband instead
  if (player.party === player.id) {
    return {
      success: false,
      message: "You are the party owner. Use /disband to disband your party.",
    };
  }

  const currentPartyId = player.party;

  // Get party members before leaving
  const partyMembers = getPartyMembers(gameRoom, currentPartyId);

  // Update player's party to their own id
  player.party = player.id;

  // Save to database
  await PlayerModel.findByIdAndUpdate(player.id, { party: player.id });

  // Notify remaining party members
  for (const member of partyMembers) {
    if (member.id !== player.id) {
      sendMessageToPlayer(
        gameRoom,
        member,
        `${player.username} has left the party.`
      );
    }
  }

  sendMessageToPlayer(
    gameRoom,
    player,
    "You have left the party."
  );

  return {
    success: true,
    message: "You have left the party.",
  };
};

/**
 * Disband the party (owner only).
 * Kicks all members back to their own parties.
 */
export const disbandParty = async (
  gameRoom: GameRoom,
  player: Player
): Promise<{ success: boolean; message: string }> => {
  // Only the party owner can disband
  if (player.party !== player.id) {
    return {
      success: false,
      message: "Only the party owner can disband the party. Use /leave to leave.",
    };
  }

  // Get all members in this party
  const partyMembers = getPartyMembers(gameRoom, player.id);

  // If it's just the owner, there's nothing to disband
  if (partyMembers.length <= 1) {
    return {
      success: false,
      message: "Your party has no other members to disband.",
    };
  }

  // Reset every non-owner member back to their own party
  for (const member of partyMembers) {
    if (member.id === player.id) continue;

    member.party = member.id;
    await PlayerModel.findByIdAndUpdate(member.id, { party: member.id });

    sendMessageToPlayer(
      gameRoom,
      member,
      "The party has been disbanded by the owner."
    );
  }

  sendMessageToPlayer(
    gameRoom,
    player,
    "You have disbanded your party."
  );

  return {
    success: true,
    message: "You have disbanded your party.",
  };
};
