namespace IznajmljivanjeKonzola.Domain.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IKlijentRepository Klijenti { get; }
        IKonzolaRepository Konzole { get; }
        IIznajmljivanjeRepository Iznajmljivanja { get; }
        IRepository<Mesto> Mesta { get; }
        IRepository<Radnik> Radnici { get; }
        IRepository<Oprema> Oprema { get; }
        int SaveChanges();

    }
}