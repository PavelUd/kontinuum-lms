using Auth.Application.Interfaces;
using Coordinator.interfaces;
using Core;
using MediatR;
using Users.Application.DTO;
using Users.Application.Interfaces;

namespace Coordinator.User.Create;

public record CreateStudentCommand(string FullName, string Phone,string? Email, int Class) : IRequest<Result<CreateUserResponse>>;

public class CreateStudentHandler 
    : IRequestHandler<CreateStudentCommand, Result<CreateUserResponse>>
{
    private readonly IUsersService _userService;
    private readonly IInvitationService _invitationService;
    private readonly ICoordinatorContext _context;

    public CreateStudentHandler(
        ICoordinatorContext context,
        IUsersService userService,
        IInvitationService invitationService)
    {
        _context = context;
        _userService = userService;
        _invitationService = invitationService;
    }

    public async Task<Result<CreateUserResponse>> Handle(CreateStudentCommand command, CancellationToken ct)
    {
        var request = new CreateStudentRequest()
        {
            Class =   command.Class,
            FullName =  command.FullName,
            Email =  command.Email,
            Phone =  command.Phone,
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