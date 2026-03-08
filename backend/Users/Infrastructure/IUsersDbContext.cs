using Microsoft.EntityFrameworkCore;
using Users.Domain;

namespace Users.Infrastructure;

public interface IUsersDbContext
{
    public DbSet<User> Users { get; set; }
}