namespace IznajmljivanjeKonzola.API.Dtos;

public record RadnikDto(int Id, string Ime, string Prezime, string KorisnickoIme);
public record CreateRadnikDto(string Ime, string Prezime, string KorisnickoIme, string Lozinka);
public record UpdateRadnikDto(string Ime, string Prezime);
