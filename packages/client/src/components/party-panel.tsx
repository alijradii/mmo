import { eventBus } from "@/game/eventBus/eventBus";
import { PartyInviteUIData, PartyMemberUIData } from "@/game/eventBus/types";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

export const PartyPanel: React.FC = () => {
  const [members, setMembers] = useState<PartyMemberUIData[]>([]);
  const [invites, setInvites] = useState<PartyInviteUIData[]>([]);

  useEffect(() => {
    const handlePartyUpdate = (data: PartyMemberUIData[]) => {
      setMembers(data);
    };

    const handleInvitesUpdate = (data: PartyInviteUIData[]) => {
      setInvites(data);
    };

    eventBus.on("update-party", handlePartyUpdate);
    eventBus.on("party-invites", handleInvitesUpdate);

    return () => {
      eventBus.off("update-party", handlePartyUpdate);
      eventBus.off("party-invites", handleInvitesUpdate);
    };
  }, []);

  const acceptInvite = (inviterUsername: string) => {
    eventBus.emit("party-invite-accept", { inviterUsername });
  };

  const declineInvite = (inviterUsername: string) => {
    eventBus.emit("party-invite-decline", { inviterUsername });
  };

  if (members.length === 0 && invites.length === 0) return null;

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto w-48">
      {/* Party Members */}
      {members.length > 0 && (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-2.5 border border-white/10">
          <div className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
            Party
          </div>
          <div className="flex flex-col gap-1.5">
            {members.map((member) => {
              const hpPercent =
                member.maxHp > 0
                  ? Math.max(0, Math.min(100, (member.hp / member.maxHp) * 100))
                  : 0;

              return (
                <div key={member.id} className="flex flex-col gap-0.5">
                  <span className="text-xs text-white/90 truncate">
                    {member.username}
                  </span>
                  <div className="relative h-3 w-full rounded-sm overflow-hidden bg-gray-800/80 border border-white/5">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-800 to-red-600 transition-all duration-300"
                      style={{ width: `${hpPercent}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-sm">
                      {member.hp} / {member.maxHp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-2.5 border border-amber-500/30">
          <div className="text-[10px] font-semibold text-amber-400/80 uppercase tracking-wider mb-1.5">
            Party Invites
          </div>
          <div className="flex flex-col gap-1.5">
            {invites.map((invite) => (
              <div
                key={invite.inviterId}
                className="flex items-center justify-between gap-1"
              >
                <span className="text-xs text-white/90 truncate flex-1">
                  {invite.inviterUsername}
                </span>
                <div className="flex gap-0.5">
                  <button
                    onClick={() => acceptInvite(invite.inviterUsername)}
                    className="p-0.5 rounded bg-green-700/60 hover:bg-green-600/80 text-white transition-colors"
                    title="Accept"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => declineInvite(invite.inviterUsername)}
                    className="p-0.5 rounded bg-red-700/60 hover:bg-red-600/80 text-white transition-colors"
                    title="Decline"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
