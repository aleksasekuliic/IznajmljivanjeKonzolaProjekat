using IznajmljivanjeKonzola.Domain.Enums;

namespace IznajmljivanjeKonzola.Domain.Repositories
{
    public interface IIznajmljivanjeRepository : IRepository<Iznajmljivanje>
    {
        IEnumerable<Iznajmljivanje> Search(int? klijentId, StatusIznajmljivanja? status);
        Iznajmljivanje? GetByIdWithDetails(int id);
    }
}