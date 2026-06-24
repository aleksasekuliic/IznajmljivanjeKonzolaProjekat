using System.ComponentModel.DataAnnotations.Schema;

namespace IznajmljivanjeKonzolaProjekat.Models
{
    public class Stavka
    {
        public int Id { get; set; }
        public int BrojSati { get; set; }                  // obracun po satu

        public int IznajmljivanjeId { get; set; }
        public Iznajmljivanje Iznajmljivanje { get; set; } = null!;
        public int OpremaId { get; set; }
        public Oprema Oprema { get; set; } = null!;

        [NotMapped]
        public decimal Iznos => BrojSati * (Oprema?.Cena ?? 0);
    }
}
