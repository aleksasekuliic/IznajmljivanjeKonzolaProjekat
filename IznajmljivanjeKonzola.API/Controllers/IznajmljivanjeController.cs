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
    [Route("iznajmljivanja")]
    [Authorize]
    public class IznajmljivanjaController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public IznajmljivanjaController(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult Pretrazi([FromQuery] int? klijentId, [FromQuery] StatusIznajmljivanja? status)
        {
            var lista = _mapper.Map<List<IznajmljivanjeDto>>(_uow.Iznajmljivanja.Search(klijentId, status));
            return Ok(lista);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var i = _uow.Iznajmljivanja.GetByIdWithDetails(id);
            if (i is null) return NotFound();
            return Ok(_mapper.Map<IznajmljivanjeDto>(i));
        }

        [HttpPost]
        [Authorize(Roles = Uloge.Radnik)]
        public IActionResult Kreiraj(
            [FromBody] CreateIznajmljivanjeDto dto,
            [FromServices] IValidator<CreateIznajmljivanjeDto> validator)
        {
            var rezultat = validator.Validate(dto);
            if (!rezultat.IsValid)
                return BadRequest(rezultat.ToDictionary());

            if (_uow.Klijenti.GetById(dto.KlijentId) is null)
                return BadRequest($"Klijent sa Id={dto.KlijentId} ne postoji.");
            if (_uow.Radnici.GetById(dto.RadnikId) is null)
                return BadRequest($"Radnik sa Id={dto.RadnikId} ne postoji.");

            var iznajmljivanje = new Iznajmljivanje
            {
                KlijentId = dto.KlijentId,
                RadnikId = dto.RadnikId,
                DatumPocetka = DateTime.Now,
                Status = StatusIznajmljivanja.Aktivno,
                Stavke = new List<Stavka>()
            };

            foreach (var s in dto.Stavke)
            {
                var oprema = _uow.Oprema.GetById(s.OpremaId);
                if (oprema is null)
                    return BadRequest($"Oprema sa Id={s.OpremaId} ne postoji.");
                if (oprema.Stanje != StanjeOpreme.Dostupno)
                    return BadRequest($"Oprema '{oprema.Naziv}' nije dostupna (stanje: {oprema.Stanje}).");

                oprema.Stanje = StanjeOpreme.Iznajmljeno; 

                iznajmljivanje.Stavke.Add(new Stavka
                {
                    OpremaId = oprema.Id,
                    BrojSati = s.BrojSati
                });
            }

            _uow.Iznajmljivanja.Add(iznajmljivanje);
            _uow.SaveChanges();

            var kreirano = _uow.Iznajmljivanja.GetByIdWithDetails(iznajmljivanje.Id)!;
            return CreatedAtAction(nameof(GetById), new { id = iznajmljivanje.Id }, MapToDto(kreirano));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Uloge.Radnik)]
        public IActionResult Izmeni(int id, [FromBody] UpdateIznajmljivanjeDto dto)
        {
            var i = _uow.Iznajmljivanja.GetByIdWithDetails(id);
            if (i is null) return NotFound();

            bool terminalno = dto.Status == StatusIznajmljivanja.Zavrseno
                           || dto.Status == StatusIznajmljivanja.Otkazano;

            if (terminalno && i.DatumZavrsetka is null)
            {
                i.DatumZavrsetka = DateTime.Now;
                foreach (var s in i.Stavke)
                    s.Oprema.Stanje = StanjeOpreme.Dostupno;
            }

            i.Status = dto.Status;
            _uow.SaveChanges();
            return NoContent();
        }

        private static IznajmljivanjeDto MapToDto(Iznajmljivanje i) =>
            new IznajmljivanjeDto(
                i.Id, i.DatumPocetka, i.DatumZavrsetka, i.Status,
                i.Stavke.Sum(s => s.Oprema.Cena * s.BrojSati),
                i.KlijentId, $"{i.Klijent.Ime} {i.Klijent.Prezime}",
                i.RadnikId, $"{i.Radnik.Ime} {i.Radnik.Prezime}",
                i.Stavke.Select(s => new StavkaDto(
                    s.Id, s.OpremaId, s.Oprema.Naziv, s.Oprema.Cena, s.BrojSati,
                    s.Oprema.Cena * s.BrojSati)).ToList());
    }
}