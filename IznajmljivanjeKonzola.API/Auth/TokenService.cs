using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using IznajmljivanjeKonzola.Infrastructure.Identity;
using Microsoft.IdentityModel.Tokens;

namespace IznajmljivanjeKonzola.API.Auth;

public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config) => _config = config;

    public string Kreiraj(ApplicationUser user, IList<string> uloge)
    {
        var jwt = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName!)
        };
        foreach (var u in uloge)
            claims.Add(new Claim(ClaimTypes.Role, u));
        if (user.KlijentId is not null)
            claims.Add(new Claim("klijentId", user.KlijentId.Value.ToString()));
        if (user.RadnikId is not null)
            claims.Add(new Claim("radnikId", user.RadnikId.Value.ToString()));

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(int.Parse(jwt["ExpiresMinutes"]!)),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
