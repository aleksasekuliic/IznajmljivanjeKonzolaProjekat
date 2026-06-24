using IznajmljivanjeKonzolaProjekat.Enums;
using System.Collections;

namespace IznajmljivanjeKonzolaProjekat.Models
{
    public abstract class Oprema
    {
        public int Id { get; set; }
        public string Naziv { get; set; } = null!;
        public string Proizvodjac { get; set; } = null!;
        public string InventarskiBroj { get; set; } = null!; 
        public decimal Cena { get; set; }                  
        public StanjeOpreme Stanje { get; set; } = StanjeOpreme.Dostupno;
        public DateTime DatumNabavke { get; set; }
        public ICollection<Stavka> Stavke { get; set; } = new List<Stavka>();
    }

}
