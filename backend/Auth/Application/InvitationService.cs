using Auth.Application.Interfaces;
using Auth.Domain;
using Auth.Infrastructure;
using Core;

namespace Auth.Application;

public class InvitationService : IInvitationService
{
    
    private readonly IAuthDbContext _context;

    public InvitationService(IAuthDbContext context)
    {
        _context = context;
    }

    public async Task<string> CreateAsync(Guid userId)
    {
             var token = Guid.NewGuid();
            var link = new InviteLink()
            {
                UserId = userId,
                Token = Guid.NewGuid(),
            };
            _context.InviteLinks.Add(link);
            await _context.SaveChangesAsync();
            return token.ToString();
    }
}