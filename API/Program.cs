using Microsoft.EntityFrameworkCore;
using Persistance;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

string connString = builder.Configuration.GetConnectionString("DefaultConnection");


// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<Persistance.DataContext>(x =>{x.UseSqlite(connString);});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// migrate any database changes on startup (includes initial db creation)
using (var scope = app.Services.CreateScope())
{
    var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    dataContext.Database.Migrate();
    await Seed.SeedData(dataContext);

    // var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    // var identityContext = scope.ServiceProvider.GetRequiredService<AppIdentityDbContext>();
    // await identityContext.Database.MigrateAsync();
    // await AppIdentityDbContextSeed.SeedUserAsync(userManager);
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
