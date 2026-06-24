using IznajmljivanjeKonzola.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace IznajmljivanjeKonzola.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly IznajmljivanjeContext Context;
        protected readonly DbSet<T> DbSet;

        public Repository(IznajmljivanjeContext context)
        {
            Context = context;
            DbSet = context.Set<T>();
        }
        public IEnumerable<T> GetAll() => DbSet.ToList();
        public T? GetById(params object[] keyValues) => DbSet.Find(keyValues);
        public IEnumerable<T> Find(Expression<Func<T, bool>> predicate) => DbSet.Where(predicate).ToList();
        public void Add(T entity) => DbSet.Add(entity);
        public void Update(T entity) => DbSet.Update(entity);
        public void Remove(T entity) => DbSet.Remove(entity);
    }
}
