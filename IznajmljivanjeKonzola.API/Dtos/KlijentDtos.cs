namespace IznajmljivanjeKonzola.API.Dtos;

public record KlijentDto(int Id, string Ime, string Prezime, string Email, string Telefon, string Mesto);
public record CreateKlijentDto(string Ime, string Prezime, string Email, string Telefon, string Lozinka, int MestoId);
public record UpdateKlijentDto(string Ime, string Prezime, string Telefon, int MestoId);
