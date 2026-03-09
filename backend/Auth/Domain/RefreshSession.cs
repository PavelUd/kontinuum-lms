using System.ComponentModel.DataAnnotations.Schema;
using Core.Entities;

namespace Auth.Domain;

[Table("refresh_session")]
public class RefreshSession : BaseEntity
{
    [Column("user_id")]
    public Guid UserId { get; set; }

    [Column("refresh_token_hash")]
    public string RefreshTokenHash { get; set; } 

    [Column("fingerprint")]
    public string Fingerprint { get;  set; } 

    [Column("ua")]
    public string? Ua { get; set; }
    
    [Column("ip")]
    public string? Ip { get;  set; }

    [Column("expires_at")]
    public DateTimeOffset ExpiresAt { get; set; }

    [Column("revoked_at")]
    public DateTimeOffset? RevokedAt { get; set; }

    public RefreshSession()
    {
        
    }
    
    
    public RefreshSession(
        Guid userId,
        string refreshTokenHash,
        string fingerprint,
        string? ua,
        string? ip,
        DateTimeOffset expiresAt)
    {
        UserId = userId;
        RefreshTokenHash = refreshTokenHash;
        Fingerprint = fingerprint;
        Ua = ua;
        Ip = ip;
        ExpiresAt = expiresAt;
    }
}