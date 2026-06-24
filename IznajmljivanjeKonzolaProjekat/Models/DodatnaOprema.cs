using IznajmljivanjeKonzolaProjekat.Enums;

namespace IznajmljivanjeKonzolaProjekat.Models
{
    public class DodatnaOprema : Oprema
    {
        public TipDodatneOpreme Tip { get; set; }         // Dzojstik, Vizir, Slusalice
        public bool Bezicna { get; set; }
        public int? KapacitetBaterijeMah { get; set; }    // null kad je zicano
        public string KompatibilanModel { get; set; } = null!;  // npr. "PS5", "Xbox Series"
    }
}
