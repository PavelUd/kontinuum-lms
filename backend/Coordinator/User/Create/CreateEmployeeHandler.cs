using Auth.Application.Interfaces;
using Coordinator.interfaces;
using Core;
using Core.Entities;
using MediatR;
using Users.Application.DTO;
using Users.Application.Interfaces;

namespace Coordinator.User.Create;

public record CreateEmployeeCommand(string FullName, string Phone,string? Email, Role Role) : IRequest<Result<CreateUserResponse>>;

public class CreateEmployeeHandler 
    : IRequestHandler<CreateEmployeeCommand, Result<CreateUserResponse>>
{
    private readonly IUsersService _userService;
    private readonly IInvitationService _invitationService;
    private readonly ICoordinatorContext _context;

    public CreateEmployeeHandler(IUsersService userService, IInvitationService invitationService, ICoordinatorContext context)
    {
        _userService = userService;
        _invitationService = invitationService;
        _context = context;
    }

    public async Task<Result<CreateUserResponse>> Handle(CreateEmployeeCommand command, CancellationToken ct)
    {
        var request = new CreateEmployeeDto()
        {
            FullName = command.FullName,
            Phone = command.Phone,
            Email = command.Email,
            Role = command.Role
        };
        await using var tx = await _context.BeginTransactionAsync(ct);
        try
        {
            var userId = await _userService.CreateUser(request);
            var inviteResult = await _invitationService.CreateAsync(userId);
            await tx.CommitAsync(ct);
            
            return await Result<CreateUserResponse>.SuccessAsync(new CreateUserResponse(userId, inviteResult));
        }
        catch(Exception e)
        {
            await tx.RollbackAsync(ct);
            return await Result<CreateUserResponse>.FailureAsync($"ошибка создания пользователя : {e.Message}");
        }
    }
}