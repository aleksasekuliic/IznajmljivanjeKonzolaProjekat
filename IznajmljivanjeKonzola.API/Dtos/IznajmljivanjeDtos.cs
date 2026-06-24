using IznajmljivanjeKonzola.Domain.Enums;

namespace IznajmljivanjeKonzola.API.Dtos;

public record StavkaDto(int Id, int OpremaId, string Oprema, int BrojSati, decimal Iznos);
public record CreateStavkaDto(int OpremaId, int BrojSati);

public record IznajmljivanjeDto(
    int Id, DateTime DatumPocetka, DateTime? DatumZavrsetka, StatusIznajmljivanja Status,
    int KlijentId, string Klijent, int RadnikId, string Radnik,
    IReadOnlyList<StavkaDto> Stavke, decimal UkupanIznos);

public record CreateIznajmljivanjeDto(
    DateTime DatumPocetka, int KlijentId, int RadnikId, IReadOnlyList<CreateStavkaDto> Stavke);
