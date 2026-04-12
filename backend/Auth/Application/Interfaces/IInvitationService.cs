using Auth.Domain;
using Core;

namespace Auth.Application.Interfaces;

public interface IInvitationService
{
    public Task<string> CreateAsync(Guid userId);

    public Task<InviteLink?> GetInviteByToken(Guid token);

    public Task ActivateLink(InviteLink link, string password);
}