using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IznajmljivanjeKonzola.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class KlijentKorisnickoImeKredit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KorisnickoIme",
                table: "Klijenti",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "Kredit",
                table: "Klijenti",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Klijenti_KorisnickoIme",
                table: "Klijenti",
                column: "KorisnickoIme",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Klijenti_KorisnickoIme",
                table: "Klijenti");

            migrationBuilder.DropColumn(
                name: "KorisnickoIme",
                table: "Klijenti");

            migrationBuilder.DropColumn(
                name: "Kredit",
                table: "Klijenti");
        }
    }
}
