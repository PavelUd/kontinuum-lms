using Core;

namespace Auth.Application.Interfaces;

public interface IInvitationService
{
    public Task<string> CreateAsync(Guid userId);
}