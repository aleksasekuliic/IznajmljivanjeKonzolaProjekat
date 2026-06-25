namespace IznajmljivanjeKonzola.Domain
{
    public class Radnik
    {
        public int Id { get; set; }
        public string Ime { get; set; } = null!;
        public string Prezime { get; set; } = null!;
        public string KorisnickoIme { get; set; } = null!;
        public ICollection<Iznajmljivanje> Iznajmljivanja { get; set; } = new List<Iznajmljivanje>();
    }
}
