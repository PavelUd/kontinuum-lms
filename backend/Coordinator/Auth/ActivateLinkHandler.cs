using Auth.Application.Interfaces;
using Coordinator.interfaces;
using Core;
using MediatR;
using Users.Application.DTO;
using Users.Application.Interfaces;
using Users.Domain;

namespace Coordinator.Auth;

public record ActivateLinkRequest(string Password);
public record ActivateLinkCommand(Guid Token, string Password, string Ip, string UserAgent, string Fingerprint) : IRequest<Result<(string, string)>>;

public class ActivateLinkHandler : IRequestHandler<ActivateLinkCommand, Result<(string, string)>>
{
    private readonly IInvitationService _invitationService;
    private readonly IUsersService _usersService;
    private readonly IAuthService _service;
    private readonly ICoordinatorContext _context;

    public ActivateLinkHandler(IInvitationService invitationService, IUsersService usersService, IAuthService service, ICoordinatorContext context)
    {
        _invitationService = invitationService;
        _usersService = usersService;
        _service = service;
        _context = context;
    }

    public async Task<Result<(string, string)>> Handle(ActivateLinkCommand request, CancellationToken ct)
    {
        var link = await _invitationService.GetInviteByToken(request.Token);
        if (link == null)
        {
            return await Result<(string, string)>.FailureAsync("ссылка не найдена");
        }
        var user = await _usersService.GetUserById<UserDto>(link.UserId);
        await using var tx = await _context.BeginTransactionAsync(ct);
        try
        {
            await _invitationService.ActivateLink(link, request.Password);
            var result = await _usersService.SetStatus(link.UserId, UserStatus.Active);
            
            if (!result.Succeeded)
            {
                await tx.RollbackAsync(ct);
                return await Result<(string, string)>.FailureAsync(result.Errors);
            }
            await tx.CommitAsync(ct);
            
            return await _service.Authenticate(user.Data.Phone, request.Password, request.Fingerprint,
                request.UserAgent, request.Ip);
        }
        catch (Exception e)
        {
            await tx.RollbackAsync(ct);
            return await Result<(string, string)>.FailureAsync("ошибка бд");
        }
    }
}