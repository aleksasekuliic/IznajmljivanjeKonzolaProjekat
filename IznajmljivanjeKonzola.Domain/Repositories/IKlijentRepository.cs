namespace IznajmljivanjeKonzola.Domain.Repositories
{
    public interface IKlijentRepository : IRepository<Klijent>
    {
        IEnumerable<Klijent> Search(string? q);
    }
}