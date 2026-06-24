using IznajmljivanjeKonzola.Domain;
using Microsoft.EntityFrameworkCore;

namespace IznajmljivanjeKonzola.Infrastructure
{
    public class IznajmljivanjeContext : DbContext
    {
        public IznajmljivanjeContext(DbContextOptions<IznajmljivanjeContext> options) : base(options)
        {

        }

        public DbSet<Mesto> Mesta => Set<Mesto>();
        public DbSet<Klijent> Klijenti => Set<Klijent>();
        public DbSet<Radnik> Radnici => Set<Radnik>();
        public DbSet<Iznajmljivanje> Iznajmljivanja => Set<Iznajmljivanje>();
        public DbSet<Stavka> Stavke => Set<Stavka>();
        public DbSet<Oprema> Oprema => Set<Oprema>();
        public DbSet<Konzola> Konzole => Set<Konzola>();
        public DbSet<DodatnaOprema> DodatnaOprema => Set<DodatnaOprema>();

        protected override void OnModelCreating(ModelBuilder mb)
        {
            mb.Entity<Mesto>().ToTable("Mesta");
            mb.Entity<Klijent>(e =>
            {
                e.ToTable("Klijenti");
                e.HasIndex(k => k.Email).IsUnique();
                e.HasOne(k => k.Mesto)
                 .WithMany(m => m.Klijenti)
                 .HasForeignKey(k => k.MestoId)
                 .HasConstraintName("FK_Klijent_Mesto")
                 .OnDelete(DeleteBehavior.Restrict);
            });
            mb.Entity<Radnik>(e =>
            {
                e.ToTable("Radnici");
                e.HasIndex(r => r.KorisnickoIme).IsUnique();
            });
            mb.Entity<Iznajmljivanje>(e =>
            {
                e.ToTable("Iznajmljivanja");
                e.Property(i => i.Status).HasConversion<string>();
                e.HasOne(i => i.Klijent)
                 .WithMany(k => k.Iznajmljivanja)
                 .HasForeignKey(i => i.KlijentId)
                 .HasConstraintName("FK_Iznajmljivanje_Klijent")
                 .OnDelete(DeleteBehavior.Restrict);
                e.HasOne(i => i.Radnik)
                 .WithMany(r => r.Iznajmljivanja)
                 .HasForeignKey(i => i.RadnikId)
                 .HasConstraintName("FK_Iznajmljivanje_Radnik")
                 .OnDelete(DeleteBehavior.Restrict);
            });
            mb.Entity<Stavka>(e =>
            {
                e.ToTable("Stavka");
                e.HasOne(s => s.Iznajmljivanje)
                .WithMany(i => i.Stavke)
                .HasForeignKey(s => s.IznajmljivanjeId)
                .HasConstraintName("FK_Stavka_Iznajmljivanje")
                .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(s => s.Oprema)
                .WithMany(o => o.Stavke)
                .HasForeignKey(s => s.OpremaId)
                .HasConstraintName("FK_Stavka_Oprema")
                .OnDelete(DeleteBehavior.Restrict);

            });
            mb.Entity<Oprema>(e =>
            {
                e.ToTable("Oprema");
                e.HasIndex(o => o.InventarskiBroj).IsUnique();
                e.Property(o => o.Cena).HasColumnType("decimal(10,2)");
                e.Property(o => o.Stanje).HasConversion<string>();
                e.HasDiscriminator<string>("TipOpreme")
                 .HasValue<Konzola>("Konzola")
                 .HasValue<DodatnaOprema>("DodatnaOprema");
            });
            mb.Entity<Konzola>().Property(k => k.Tip)
                .HasColumnName("TipKonzole").HasConversion<string>();
            mb.Entity<DodatnaOprema>().Property(d => d.Tip)
                .HasColumnName("TipDodatneOpreme").HasConversion<string>();
        }
    }
}
