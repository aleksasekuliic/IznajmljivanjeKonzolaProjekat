using Microsoft.AspNetCore.Identity;

namespace IznajmljivanjeKonzola.Infrastructure.Identity;

// Auth identitet (lozinka, username). Vezuje se na domenski Klijent ili Radnik.
public class ApplicationUser : IdentityUser<int>
{
    public int? KlijentId { get; set; }
    public int? RadnikId { get; set; }
}
