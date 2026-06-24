using IznajmljivanjeKonzola.Domain;
using IznajmljivanjeKonzola.Domain.Repositories;
using Microsoft.EntityFrameworkCore;


namespace IznajmljivanjeKonzola.Infrastructure.Repositories
{
    public class KlijentRepository : Repository<Klijent>, IKlijentRepository
    {
        public KlijentRepository(IznajmljivanjeContext context) : base(context) { }

        public IEnumerable<Klijent> Search(string? q)
        {
            var query = DbSet.Include(k => k.Mesto).AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(k =>
                    k.Ime.Contains(q) || k.Prezime.Contains(q) || k.Email.Contains(q));
            return query.ToList();
        }
    }
}
