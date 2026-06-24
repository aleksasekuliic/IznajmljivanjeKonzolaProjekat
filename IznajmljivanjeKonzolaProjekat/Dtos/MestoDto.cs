namespace IznajmljivanjeKonzolaProjekat.Dtos;

public record MestoDto(int Id, string Naziv, string PostanskiBroj);
public record CreateMestoDto(string Naziv, string PostanskiBroj);
public record UpdateMestoDto(string Naziv, string PostanskiBroj);