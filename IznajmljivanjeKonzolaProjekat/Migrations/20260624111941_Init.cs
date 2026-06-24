using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IznajmljivanjeKonzolaProjekat.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Mesta",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PostanskiBroj = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mesta", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Oprema",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Proizvodjac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InventarskiBroj = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Cena = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Stanje = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DatumNabavke = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TipOpreme = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: false),
                    TipDodatneOpreme = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bezicna = table.Column<bool>(type: "bit", nullable: true),
                    KapacitetBaterijeMah = table.Column<int>(type: "int", nullable: true),
                    KompatibilanModel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TipKonzole = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Model = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    KapacitetSkladistaGb = table.Column<int>(type: "int", nullable: true),
                    BrojKontrolera = table.Column<int>(type: "int", nullable: true),
                    PodrzavaVr = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oprema", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Radnici",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KorisnickoIme = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LozinkaHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Radnici", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Klijenti",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Telefon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LozinkaHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MestoId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Klijenti", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Klijent_Mesto",
                        column: x => x.MestoId,
                        principalTable: "Mesta",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Iznajmljivanja",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DatumPocetka = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DatumZavrsetka = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KlijentId = table.Column<int>(type: "int", nullable: false),
                    RadnikId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Iznajmljivanja", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Iznajmljivanje_Klijent",
                        column: x => x.KlijentId,
                        principalTable: "Klijenti",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Iznajmljivanje_Radnik",
                        column: x => x.RadnikId,
                        principalTable: "Radnici",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Stavka",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BrojSati = table.Column<int>(type: "int", nullable: false),
                    IznajmljivanjeId = table.Column<int>(type: "int", nullable: false),
                    OpremaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stavka", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stavka_Iznajmljivanje",
                        column: x => x.IznajmljivanjeId,
                        principalTable: "Iznajmljivanja",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Stavka_Oprema",
                        column: x => x.OpremaId,
                        principalTable: "Oprema",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Iznajmljivanja_KlijentId",
                table: "Iznajmljivanja",
                column: "KlijentId");

            migrationBuilder.CreateIndex(
                name: "IX_Iznajmljivanja_RadnikId",
                table: "Iznajmljivanja",
                column: "RadnikId");

            migrationBuilder.CreateIndex(
                name: "IX_Klijenti_Email",
                table: "Klijenti",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Klijenti_MestoId",
                table: "Klijenti",
                column: "MestoId");

            migrationBuilder.CreateIndex(
                name: "IX_Oprema_InventarskiBroj",
                table: "Oprema",
                column: "InventarskiBroj",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Radnici_KorisnickoIme",
                table: "Radnici",
                column: "KorisnickoIme",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Stavka_IznajmljivanjeId",
                table: "Stavka",
                column: "IznajmljivanjeId");

            migrationBuilder.CreateIndex(
                name: "IX_Stavka_OpremaId",
                table: "Stavka",
                column: "OpremaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Stavka");

            migrationBuilder.DropTable(
                name: "Iznajmljivanja");

            migrationBuilder.DropTable(
                name: "Oprema");

            migrationBuilder.DropTable(
                name: "Klijenti");

            migrationBuilder.DropTable(
                name: "Radnici");

            migrationBuilder.DropTable(
                name: "Mesta");
        }
    }
}
