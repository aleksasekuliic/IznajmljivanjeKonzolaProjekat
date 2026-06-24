namespace IznajmljivanjeKonzola.Domain.Repositories
{
    public interface IKonzolaRepository : IRepository<Konzola>
    {
        IEnumerable<Konzola> Search(string? q);
    }
}