namespace IznajmljivanjeKonzola.API.Dtos;

public record LoginDto(string KorisnickoIme, string Lozinka);
public record AuthResponseDto(string Token, string Uloga);
