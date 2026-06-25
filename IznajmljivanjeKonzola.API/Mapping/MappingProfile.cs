using AutoMapper;
using IznajmljivanjeKonzola.API.Dtos;
using IznajmljivanjeKonzola.Domain;

namespace IznajmljivanjeKonzola.API.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Konzola, KonzolaDto>();

        CreateMap<Klijent, KlijentDto>()
            .ForCtorParam("Mesto", o => o.MapFrom(s => s.Mesto != null ? s.Mesto.Naziv : ""));

        CreateMap<Stavka, StavkaDto>()
            .ForCtorParam("Oprema", o => o.MapFrom(s => s.Oprema.Naziv))
            .ForCtorParam("Cena", o => o.MapFrom(s => s.Oprema.Cena))
            .ForCtorParam("Iznos", o => o.MapFrom(s => s.Oprema.Cena * s.BrojSati));

        CreateMap<Iznajmljivanje, IznajmljivanjeDto>()
            .ForCtorParam("Klijent", o => o.MapFrom(s => s.Klijent.Ime + " " + s.Klijent.Prezime))
            .ForCtorParam("Radnik", o => o.MapFrom(s => s.Radnik.Ime + " " + s.Radnik.Prezime))
            .ForCtorParam("UkupanIznos", o => o.MapFrom(s => s.Stavke.Sum(x => x.Oprema.Cena * x.BrojSati)));
    }
}
