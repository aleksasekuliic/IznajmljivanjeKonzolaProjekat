namespace IznajmljivanjeKonzolaProjekat.Models
{
    public class Klijent
    {
        public int Id { get; set; }
        public string Ime { get; set; } = null!;
        public string Prezime { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Telefon { get; set; } = null!;
        public string LozinkaHash { get; set; } = null!;   // za SK2, SK4
        public int MestoId { get; set; }
        public Mesto Mesto { get; set; } = null!;
        public ICollection<Iznajmljivanje> Iznajmljivanja { get; set; } = new List<Iznajmljivanje>();
    }
}
