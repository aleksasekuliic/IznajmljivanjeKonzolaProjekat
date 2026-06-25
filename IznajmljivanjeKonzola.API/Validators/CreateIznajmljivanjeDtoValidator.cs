using FluentValidation;
using IznajmljivanjeKonzola.API.Dtos;

namespace IznajmljivanjeKonzola.API.Validators;

public class CreateIznajmljivanjeDtoValidator : AbstractValidator<CreateIznajmljivanjeDto>
{
    public CreateIznajmljivanjeDtoValidator()
    {
        RuleFor(x => x.KlijentId).GreaterThan(0);
        RuleFor(x => x.RadnikId).GreaterThan(0);
        RuleFor(x => x.Stavke).NotEmpty().WithMessage("Mora postojati bar jedna stavka.");
        RuleForEach(x => x.Stavke).SetValidator(new CreateStavkaDtoValidator());
    }
}

public class CreateStavkaDtoValidator : AbstractValidator<CreateStavkaDto>
{
    public CreateStavkaDtoValidator()
    {
        RuleFor(x => x.OpremaId).GreaterThan(0);
        RuleFor(x => x.BrojSati).GreaterThan(0);
    }
}
