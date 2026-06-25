using System.Text;
using FluentValidation;
using IznajmljivanjeKonzola.API.Auth;
using IznajmljivanjeKonzola.Domain.Repositories;
using IznajmljivanjeKonzola.Infrastructure;
using IznajmljivanjeKonzola.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.Services.AddAutoMapper(cfg => { }, typeof(IznajmljivanjeKonzola.API.Mapping.MappingProfile).Assembly);

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<TokenService>();

builder.Services.AddDbContext<IznajmljivanjeContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<ApplicationUser>(o =>
{
    o.Password.RequiredLength = 6;
    o.Password.RequireNonAlphanumeric = false;
    o.User.RequireUniqueEmail = false;
})
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<IznajmljivanjeContext>();

var jwt = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    await IdentitySeeder.SeedAsync(scope.ServiceProvider);
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
