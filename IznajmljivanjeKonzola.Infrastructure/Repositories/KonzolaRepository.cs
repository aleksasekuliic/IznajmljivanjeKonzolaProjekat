using IznajmljivanjeKonzola.Domain;
using IznajmljivanjeKonzola.Domain.Repositories;

namespace IznajmljivanjeKonzola.Infrastructure.Repositories
{
    public class KonzolaRepository : Repository<Konzola>, IKonzolaRepository
    {
        public KonzolaRepository(IznajmljivanjeContext context) : base(context) { }
        public IEnumerable<Konzola> Search(string? q)
        {
            var query = DbSet.AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(k =>
                    k.Naziv.Contains(q) || k.Model.Contains(q) || k.Proizvodjac.Contains(q));
            return query.ToList();
        }
    }
}