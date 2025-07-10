import { DiscordRoleQueue } from "../database/models/discordRoleQueue.model";
import { IPlayer } from "../database/models/player.model";

/**
 * Queues a Discord role assignment for a user.
 * @param user - Object with Discord ID and selected class
 */
export async function queueDiscordRole(user: IPlayer) {
  const queueEntry = new DiscordRoleQueue({
    discord_id: user._id,
    class: user.class.toLowerCase(),
  });

  await queueEntry.save();
}
