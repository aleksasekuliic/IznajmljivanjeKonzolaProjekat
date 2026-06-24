using IznajmljivanjeKonzolaProjekat.Enums;

namespace IznajmljivanjeKonzolaProjekat.Models
{
    public class Konzola : Oprema
    {
        public TipKonzole Tip { get; set; }
        public string Model { get; set; } = null!;        // PS5 Slim, Xbox Series X
        public int KapacitetSkladistaGb { get; set; }     // 512, 1024
        public int BrojKontrolera { get; set; }           // koliko dzojstika ide uz konzolu
        public bool PodrzavaVr { get; set; }
    }
}
