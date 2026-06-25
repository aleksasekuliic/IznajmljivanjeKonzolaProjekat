using AutoMapper;
using IznajmljivanjeKonzola.API.Auth;
using IznajmljivanjeKonzola.API.Dtos;
using IznajmljivanjeKonzola.Domain.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IznajmljivanjeKonzola.API.Controllers
{
    [ApiController]
    [Route("klijenti")]
    [Authorize]
    public class KlijentiController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public KlijentiController(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Pretrazi([FromQuery] string? q)
        {
            var klijenti = _mapper.Map<List<KlijentDto>>(_uow.Klijenti.Search(q));
            return Ok(klijenti);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var k = _uow.Klijenti.GetById(id);
            if (k == null)
                return NotFound();
            return Ok(_mapper.Map<KlijentDto>(k));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Uloge.Radnik)]
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
        [Authorize(Roles = Uloge.Radnik)]
        public IActionResult Obrisi(int id)
        {
            var k = _uow.Klijenti.GetById(id);
            if (k == null) return NotFound();

            _uow.Klijenti.Remove(k);
            _uow.SaveChanges();

            return NoContent();
        }

        [HttpPost("{id}/kredit")]
        [Authorize(Roles = Uloge.Radnik)]
        public IActionResult DodajKredit(int id, [FromBody] DodajKreditDto dto)
        {
            if (dto.Iznos == 0)
                return BadRequest("Iznos ne sme biti nula.");

            var k = _uow.Klijenti.GetById(id);
            if (k is null) return NotFound();

            k.Kredit += dto.Iznos;
            _uow.SaveChanges();

            return Ok(new { k.Id, k.Kredit });
        }
    }
}