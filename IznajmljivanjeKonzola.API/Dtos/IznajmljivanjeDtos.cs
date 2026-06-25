using IznajmljivanjeKonzola.Domain.Enums;

namespace IznajmljivanjeKonzola.API.Dtos;

public record StavkaDto(int Id, int OpremaId, string Oprema, decimal Cena, int BrojSati, decimal Iznos);
public record CreateStavkaDto(int OpremaId, int BrojSati);

public record IznajmljivanjeDto(
    int Id, DateTime DatumPocetka, DateTime? DatumZavrsetka, StatusIznajmljivanja Status,
    decimal UkupanIznos, int KlijentId, string Klijent, int RadnikId, string Radnik,
    List<StavkaDto> Stavke);

public record CreateIznajmljivanjeDto(int KlijentId, int RadnikId, List<CreateStavkaDto> Stavke);
public record UpdateIznajmljivanjeDto(StatusIznajmljivanja Status);