using Microsoft.AspNetCore.Identity;

namespace IznajmljivanjeKonzola.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<int>
{
    public int? KlijentId { get; set; }
    public int? RadnikId { get; set; }
}
