using FluentValidation;
using IznajmljivanjeKonzola.API.Dtos;

namespace IznajmljivanjeKonzola.API.Validators;

public class CreateKlijentDtoValidator : AbstractValidator<CreateKlijentDto>
{
    public CreateKlijentDtoValidator()
    {
        RuleFor(x => x.Ime).NotEmpty();
        RuleFor(x => x.Prezime).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Telefon).NotEmpty();
        RuleFor(x => x.MestoId).GreaterThan(0);
    }
}
