using IznajmljivanjeKonzola.Domain;
using IznajmljivanjeKonzola.Domain.Repositories;
using IznajmljivanjeKonzola.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Text;

namespace IznajmljivanjeKonzola.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IznajmljivanjeContext _context;

        private IKlijentRepository? _klijenti;
        private IKonzolaRepository? _konzole;
        private IIznajmljivanjeRepository? _iznajmljivanja;
        private IRepository<Mesto>? _mesta;
        private IRepository<Radnik>? _radnici;
        private IRepository<Oprema>? _oprema;

        public UnitOfWork(IznajmljivanjeContext context) => _context = context;

        public IKlijentRepository Klijenti => _klijenti ??= new KlijentRepository(_context);
        public IKonzolaRepository Konzole => _konzole ??= new KonzolaRepository(_context);
        public IIznajmljivanjeRepository Iznajmljivanja => _iznajmljivanja ??= new IznajmljivanjeRepository(_context);
        public IRepository<Mesto> Mesta => _mesta ??= new Repository<Mesto>(_context);
        public IRepository<Radnik> Radnici => _radnici ??= new Repository<Radnik>(_context);
        public IRepository<Oprema> Oprema => _oprema ??= new Repository<Oprema>(_context);

        public int SaveChanges() => _context.SaveChanges();
        public void Dispose() => _context.Dispose();
    }
}
