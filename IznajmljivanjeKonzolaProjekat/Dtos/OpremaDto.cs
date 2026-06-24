using IznajmljivanjeKonzolaProjekat.Enums;

namespace IznajmljivanjeKonzolaProjekat.Dtos;

public record KonzolaDto(
    int Id, string Naziv, string Proizvodjac, string InventarskiBroj, decimal Cena,
    StanjeOpreme Stanje, DateTime DatumNabavke,
    TipKonzole Tip, string Model, int KapacitetSkladistaGb, int BrojKontrolera, bool PodrzavaVr);

public record CreateKonzolaDto(
    string Naziv, string Proizvodjac, string InventarskiBroj, decimal Cena, DateTime DatumNabavke,
    TipKonzole Tip, string Model, int KapacitetSkladistaGb, int BrojKontrolera, bool PodrzavaVr);

public record UpdateKonzolaDto(
    string Naziv, string Proizvodjac, decimal Cena, StanjeOpreme Stanje,
    TipKonzole Tip, string Model, int KapacitetSkladistaGb, int BrojKontrolera, bool PodrzavaVr);

public record DodatnaOpremaDto(
    int Id, string Naziv, string Proizvodjac, string InventarskiBroj, decimal Cena,
    StanjeOpreme Stanje, DateTime DatumNabavke,
    TipDodatneOpreme Tip, bool Bezicna, int? KapacitetBaterijeMah, string KompatibilanModel);

public record CreateDodatnaOpremaDto(
    string Naziv, string Proizvodjac, string InventarskiBroj, decimal Cena, DateTime DatumNabavke,
    TipDodatneOpreme Tip, bool Bezicna, int? KapacitetBaterijeMah, string KompatibilanModel);

public record UpdateDodatnaOpremaDto(
    string Naziv, string Proizvodjac, decimal Cena, StanjeOpreme Stanje,
    TipDodatneOpreme Tip, bool Bezicna, int? KapacitetBaterijeMah, string KompatibilanModel);
