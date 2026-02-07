import { GameRoom } from "../../../rooms/gameRoom";
import { Player } from "../../player/player";
import { PlayerModel } from "../../../database/models/player.model";

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

/**
 * Invite a player to join your party
 */
export const inviteToParty = async (
  gameRoom: GameRoom,
  inviter: Player,
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

  // Send invitation message to target
  sendMessageToPlayer(
    gameRoom,
    targetPlayer,
    `${inviter.username} has invited you to join their party. Use /join ${inviter.username} to accept.`
  );

  return {
    success: true,
    message: `Invitation sent to ${targetPlayer.username}.`,
  };
};

/**
 * Join another player's party
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

  const oldPartyId = joiner.party;
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

  return {
    success: true,
    message: `You have joined ${targetPlayer.username}'s party.`,
  };
};

/**
 * Disband the party (leave and return to your own party)
 */
export const disbandParty = async (
  gameRoom: GameRoom,
  player: Player
): Promise<{ success: boolean; message: string }> => {
  const currentPartyId = player.party;

  // Check if player is already in their own party
  if (player.party === player.id) {
    return {
      success: false,
      message: "You are already in your own party.",
    };
  }

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
    "You have left the party and returned to your own party."
  );

  return {
    success: true,
    message: "You have left the party.",
  };
};


