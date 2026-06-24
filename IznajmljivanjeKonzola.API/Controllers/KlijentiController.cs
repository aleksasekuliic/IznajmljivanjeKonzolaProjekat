using IznajmljivanjeKonzola.API.Dtos;
using IznajmljivanjeKonzola.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace IznajmljivanjeKonzola.API.Controllers
{
    [ApiController]
    [Route("klijenti")]
    public class KlijentiController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public KlijentiController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet]
        public IActionResult Pretrazi([FromQuery] string? q)
        {
            var klijenti = _uow.Klijenti.Search(q)
                .Select(k => new KlijentDto(
                    k.Id, k.Ime, k.Prezime, k.KorisnickoIme,
                    k.Email, k.Telefon, k.Kredit, k.MestoId, k.Mesto.Naziv))
                .ToList();
            return Ok(klijenti);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var k = _uow.Klijenti.GetById(id);
            if (k == null)
                return NotFound();
            return Ok(new KlijentDto(
                k.Id, k.Ime, k.Prezime, k.KorisnickoIme,
                k.Email, k.Telefon, k.Kredit, k.MestoId, k.Mesto?.Naziv ?? ""));
        }

        [HttpPut("{id}")]
        public IActionResult Izmeni(int id, [FromBody] UpdateKlijentDto dto)
        {
            var k = _uow.Klijenti.GetById(id);
            if (k == null) return NotFound();

            if (_uow.Mesta.GetById(dto.MestoId) is null) return BadRequest($"Mesto sa Id={dto.MestoId} ne postoji.");

            k.Ime = dto.Ime;
            k.Prezime = dto.Prezime;
            k.Telefon = dto.Telefon;
            k.MestoId = dto.MestoId;

            _uow.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Obrisi(int id)
        {
            var k = _uow.Klijenti.GetById(id);
            if (k == null) return NotFound();

            _uow.Klijenti.Remove(k);
            _uow.SaveChanges();

            return NoContent();
        }

        [HttpPost("{id}/kredit")]
        public IActionResult DodajKredit(int id, [FromBody] DodajKreditDto dto)
        {
            if (dto.Iznos <= 0)
                return BadRequest("Iznos mora biti pozitivan.");

            var k = _uow.Klijenti.GetById(id);
            if (k is null) return NotFound();

            k.Kredit += dto.Iznos;
            _uow.SaveChanges();

            return Ok(new { k.Id, k.Kredit });
        }
    }
}