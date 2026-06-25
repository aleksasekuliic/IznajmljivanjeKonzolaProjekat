using FluentValidation;
using IznajmljivanjeKonzola.API.Auth;
using IznajmljivanjeKonzola.API.Dtos;
using IznajmljivanjeKonzola.Domain;
using IznajmljivanjeKonzola.Domain.Repositories;
using IznajmljivanjeKonzola.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IznajmljivanjeKonzola.API.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TokenService _tokenService;

        public AuthController(
            IUnitOfWork uow,
            UserManager<ApplicationUser> userManager,
            TokenService tokenService)
        {
            _uow = uow;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] CreateKlijentDto dto,
            [FromServices] IValidator<CreateKlijentDto> validator)
        {
            var rezultat = validator.Validate(dto);
            if (!rezultat.IsValid)
                return BadRequest(rezultat.ToDictionary());

            if (_uow.Mesta.GetById(dto.MestoId) is null)
                return BadRequest($"Mesto sa Id={dto.MestoId} ne postoji.");
            if (await _userManager.FindByNameAsync(dto.Email) is not null)
                return BadRequest("Korisnik sa tim email-om već postoji.");

            var klijent = new Klijent
            {
                Ime = dto.Ime,
                Prezime = dto.Prezime,
                Email = dto.Email,
                Telefon = dto.Telefon,
                KorisnickoIme = dto.Email,
                MestoId = dto.MestoId
            };
            _uow.Klijenti.Add(klijent);
            _uow.SaveChanges();

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                KlijentId = klijent.Id
            };
            var created = await _userManager.CreateAsync(user, dto.Lozinka);
            if (!created.Succeeded)
            {
                _uow.Klijenti.Remove(klijent);
                _uow.SaveChanges();
                return BadRequest(created.Errors.Select(e => e.Description));
            }

            await _userManager.AddToRoleAsync(user, Uloge.Klijent);

            var token = _tokenService.Kreiraj(user, new[] { Uloge.Klijent });
            return Ok(new AuthResponseDto(token, Uloge.Klijent));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByNameAsync(dto.KorisnickoIme);
            if (user is null || !await _userManager.CheckPasswordAsync(user, dto.Lozinka))
                return Unauthorized("Pogrešno korisničko ime ili lozinka.");

            var uloge = await _userManager.GetRolesAsync(user);
            var token = _tokenService.Kreiraj(user, uloge);
            return Ok(new AuthResponseDto(token, uloge.FirstOrDefault() ?? ""));
        }
    }
}
