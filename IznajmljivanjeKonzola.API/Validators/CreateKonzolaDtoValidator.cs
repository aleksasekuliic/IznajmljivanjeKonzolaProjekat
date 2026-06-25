using FluentValidation;
using IznajmljivanjeKonzola.API.Dtos;

namespace IznajmljivanjeKonzola.API.Validators;

public class CreateKonzolaDtoValidator : AbstractValidator<CreateKonzolaDto>
{
    public CreateKonzolaDtoValidator()
    {
        RuleFor(x => x.Naziv).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Proizvodjac).NotEmpty();
        RuleFor(x => x.InventarskiBroj).NotEmpty();
        RuleFor(x => x.Cena).GreaterThan(0);
        RuleFor(x => x.Model).NotEmpty();
        RuleFor(x => x.KapacitetSkladistaGb).GreaterThan(0);
        RuleFor(x => x.BrojKontrolera).GreaterThanOrEqualTo(0);
    }
}
