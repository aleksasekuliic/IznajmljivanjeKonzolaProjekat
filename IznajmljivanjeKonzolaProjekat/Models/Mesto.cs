namespace IznajmljivanjeKonzolaProjekat.Models
{
    public class Mesto
    {
        public int Id { get; set; }
        public string Naziv { get; set; } = null!;
        public string PostanskiBroj { get; set; } = null!;
        public ICollection<Klijent> Klijenti { get; set; } = new List<Klijent>();
    }
}
