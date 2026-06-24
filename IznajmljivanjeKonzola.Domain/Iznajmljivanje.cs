using IznajmljivanjeKonzola.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace IznajmljivanjeKonzola.Domain
{
    public class Iznajmljivanje
    {
        public int Id { get; set; }
        public DateTime DatumPocetka { get; set; }
        public DateTime? DatumZavrsetka { get; set; }
        public StatusIznajmljivanja Status { get; set; } = StatusIznajmljivanja.Kreirano;

        public int KlijentId { get; set; }                 // klijent zakljucuje
        public Klijent Klijent { get; set; } = null!;
        public int RadnikId { get; set; }                  // radnik potpisuje
        public Radnik Radnik { get; set; } = null!;

        public ICollection<Stavka> Stavke { get; set; } = new List<Stavka>();

        [NotMapped]
        public decimal UkupanIznos => Stavke.Sum(s => s.Iznos);
    }
}
