using Auth.Application.Interfaces;
using Auth.Domain;
using Auth.Infrastructure;
using Contracts.Contracts.Users;
using Contracts.Services;
using Core;
using Microsoft.EntityFrameworkCore;

namespace Auth.Application;

public class InvitationService : IInvitationService
{
    
    private readonly IAuthDbContext _context;
    private readonly IUserQueryService _userQueryService;
    private readonly IHashingService _hashingService;
    private readonly IAuthService _authService;

    public InvitationService(IAuthDbContext context, IUserQueryService userQueryService, IHashingService hashingService, IAuthService authService)
    {
        _context = context;
        _userQueryService = userQueryService;
        _hashingService = hashingService;
        _authService = authService;
    }

    public async Task<string> CreateAsync(Guid userId)
    {
            var token = Guid.NewGuid();
            var link = new InviteLink()
            {
                UserId = userId,
                Token =  token,
            };
            _context.InviteLinks.Add(link);
            await _context.SaveChangesAsync();
            return token.ToString();
    }
    
    public async Task<InviteLink?> GetInviteByToken(Guid token)
    {
       return await _context.InviteLinks.FirstOrDefaultAsync(x => x.Token == token);
    }

    public async Task ActivateLink(InviteLink link, string password)
    {
        var credentials = _hashingService.HashWithSalt(password);
        _context.Credentials.Add(new Credential()
            {
                UserId = link.UserId,
                Password = credentials.hashedPassword,
                Salt = credentials.salt
            });
            _context.InviteLinks.Remove(link);
            await _context.SaveChangesAsync();
        
    }
}