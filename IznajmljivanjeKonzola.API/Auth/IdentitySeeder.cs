using IznajmljivanjeKonzola.Domain;
using IznajmljivanjeKonzola.Domain.Repositories;
using IznajmljivanjeKonzola.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

namespace IznajmljivanjeKonzola.API.Auth;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider sp)
    {
        var roleManager = sp.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var userManager = sp.GetRequiredService<UserManager<ApplicationUser>>();
        var uow = sp.GetRequiredService<IUnitOfWork>();

        foreach (var rola in new[] { Uloge.Radnik, Uloge.Klijent })
            if (!await roleManager.RoleExistsAsync(rola))
                await roleManager.CreateAsync(new IdentityRole<int>(rola));

        const string adminUser = "admin";
        if (await userManager.FindByNameAsync(adminUser) is null)
        {
            var radnik = new Radnik { Ime = "Admin", Prezime = "Radnik", KorisnickoIme = adminUser };
            uow.Radnici.Add(radnik);
            uow.SaveChanges();

            var user = new ApplicationUser { UserName = adminUser, RadnikId = radnik.Id };
            var rezultat = await userManager.CreateAsync(user, "Admin123!");
            if (rezultat.Succeeded)
                await userManager.AddToRoleAsync(user, Uloge.Radnik);
        }
    }
}
