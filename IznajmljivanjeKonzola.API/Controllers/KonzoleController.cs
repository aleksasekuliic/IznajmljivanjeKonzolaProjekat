using AutoMapper;
using FluentValidation;
using IznajmljivanjeKonzola.API.Auth;
using IznajmljivanjeKonzola.API.Dtos;
using IznajmljivanjeKonzola.Domain;
using IznajmljivanjeKonzola.Domain.Enums;
using IznajmljivanjeKonzola.Domain.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IznajmljivanjeKonzola.API.Controllers
{
    [ApiController]
    [Route("konzole")]
    [Authorize]
    public class KonzoleController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public KonzoleController(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Pretrazi([FromQuery] string? q)
        {
            var konzole = _mapper.Map<List<KonzolaDto>>(_uow.Konzole.Search(q));
            return Ok(konzole);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var k = _uow.Konzole.GetById(id);
            if (k is null) return NotFound();

            return Ok(_mapper.Map<KonzolaDto>(k));
        }

        [HttpPost]
        [Authorize(Roles = Uloge.Radnik)]
        public IActionResult Kreiraj(
            [FromBody] CreateKonzolaDto dto,
            [FromServices] IValidator<CreateKonzolaDto> validator)
        {
            var rezultat = validator.Validate(dto);
            if (!rezultat.IsValid)
                return BadRequest(rezultat.ToDictionary());

            var konzola = new Konzola
            {
                Naziv = dto.Naziv,
                Proizvodjac = dto.Proizvodjac,
                InventarskiBroj = dto.InventarskiBroj,
                Cena = dto.Cena,
                Stanje = StanjeOpreme.Dostupno,
                DatumNabavke = dto.DatumNabavke,
                Tip = dto.Tip,
                Model = dto.Model,
                KapacitetSkladistaGb = dto.KapacitetSkladistaGb,
                BrojKontrolera = dto.BrojKontrolera,
                PodrzavaVr = dto.PodrzavaVr
            };

            _uow.Konzole.Add(konzola);
            _uow.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = konzola.Id }, konzola.Id);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Uloge.Radnik)]
        public IActionResult Izmeni(int id, [FromBody] UpdateKonzolaDto dto)
        {
            var k = _uow.Konzole.GetById(id);
            if (k is null) return NotFound();

            k.Naziv = dto.Naziv;
            k.Proizvodjac = dto.Proizvodjac;
            k.Cena = dto.Cena;
            k.Stanje = dto.Stanje;
            k.Tip = dto.Tip;
            k.Model = dto.Model;
            k.KapacitetSkladistaGb = dto.KapacitetSkladistaGb;
            k.BrojKontrolera = dto.BrojKontrolera;
            k.PodrzavaVr = dto.PodrzavaVr;

            _uow.SaveChanges();
            return NoContent();
        }

        // SK9 - ObrisiKonzolu
        [HttpDelete("{id}")]
        [Authorize(Roles = Uloge.Radnik)]
        public IActionResult Obrisi(int id)
        {
            var k = _uow.Konzole.GetById(id);
            if (k is null) return NotFound();

            _uow.Konzole.Remove(k);
            _uow.SaveChanges();
            return NoContent();
        }
    }
}
