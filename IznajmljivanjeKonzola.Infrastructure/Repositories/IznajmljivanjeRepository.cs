using IznajmljivanjeKonzola.Domain;
using IznajmljivanjeKonzola.Domain.Enums;
using IznajmljivanjeKonzola.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace IznajmljivanjeKonzola.Infrastructure.Repositories
{
    public class IznajmljivanjeRepository : Repository<Iznajmljivanje>, IIznajmljivanjeRepository
    {
        public IznajmljivanjeRepository(IznajmljivanjeContext context) : base(context) { }

        public Iznajmljivanje? GetByIdWithDetails(int id) =>
            DbSet
            .Include(i => i.Klijent)
            .Include(i => i.Radnik)
            .Include(i => i.Stavke).ThenInclude(s => s.Oprema)
            .FirstOrDefault(i => i.Id == id);
       

        public IEnumerable<Iznajmljivanje> Search(int? klijentId, StatusIznajmljivanja? status) { 
            var query = DbSet
                .Include(i => i.Klijent)
                .Include(i => i.Radnik)
                .Include(i => i.Stavke).ThenInclude(s => s.Oprema)
                .AsQueryable();
            if(klijentId.HasValue)
                query = query.Where(i => i.KlijentId == klijentId.Value);
            if(status.HasValue)
                query = query.Where(i => i.Status == status.Value);

            return query.ToList();
        }
    }
}
