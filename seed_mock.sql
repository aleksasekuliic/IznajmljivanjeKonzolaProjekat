SET NOCOUNT ON;

BEGIN TRANSACTION;

-- Mesta (Id je IDENTITY -> 1..5 redom)
INSERT INTO Mesta (Naziv, PostanskiBroj) VALUES
 (N'Beograd',    N'11000'),
 (N'Novi Sad',   N'21000'),
 (N'Niš',        N'18000'),
 (N'Kragujevac', N'34000'),
 (N'Subotica',   N'24000');

-- Klijenti -> MestoId referencira gornjih 5 mesta (1..5)
-- LozinkaHash je placeholder bcrypt hash (auth jos nije implementiran)
DECLARE @hash NVARCHAR(200) = N'$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

INSERT INTO Klijenti (Ime, Prezime, Email, Telefon, KorisnickoIme, Kredit, LozinkaHash, MestoId) VALUES
 (N'Marko',   N'Marković',  N'marko.markovic@example.com',   N'+381641111111', N'marko.m',   1500.00, @hash, 1),
 (N'Jovana',  N'Jovanović', N'jovana.jovanovic@example.com', N'+381642222222', N'jovana.j',  500.00,  @hash, 1),
 (N'Stefan',  N'Petrović',  N'stefan.petrovic@example.com',  N'+381643333333', N'stefan.p',  0.00,    @hash, 2),
 (N'Milica',  N'Nikolić',   N'milica.nikolic@example.com',   N'+381644444444', N'milica.n',  2750.50, @hash, 2),
 (N'Nikola',  N'Đorđević',  N'nikola.djordjevic@example.com',N'+381645555555', N'nikola.dj', 100.00,  @hash, 3),
 (N'Ana',     N'Ilić',      N'ana.ilic@example.com',         N'+381646666666', N'ana.i',     320.00,  @hash, 4),
 (N'Luka',    N'Pavlović',  N'luka.pavlovic@example.com',    N'+381647777777', N'luka.p',    0.00,    @hash, 5),
 (N'Teodora', N'Stanković', N'teodora.stankovic@example.com',N'+381648888888', N'teodora.s', 999.99,  @hash, 5);

COMMIT;

SELECT COUNT(*) AS Mesta FROM Mesta;
SELECT COUNT(*) AS Klijenti FROM Klijenti;
