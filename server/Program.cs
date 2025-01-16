using TodoApi;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>(); 
}

var connectionString = builder.Configuration.GetConnectionString("ToDoList");

builder.Services.AddDbContext<ToDoListContext>(options =>
    options.UseMySql(
        connectionString,
                ServerVersion.AutoDetect(connectionString)

    )
);


Console.WriteLine($"Connection String: {builder.Configuration.GetConnectionString("ToDoList")}");



builder.Services.AddDbContext<ToDoListContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("ToDoList"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("ToDoList"))
    )
);


// builder.Services.Configure<Application>(builder.Configuration.GetSection(nameof(Application)));

// builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, CustomAuthorizationHandler>();


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
        Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
        };
    });

// CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy("general", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});


var app = builder.Build();
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}
app.UseHttpsRedirection();

app.UseCors("general");


app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor |
    ForwardedHeaders.XForwardedProto
});

app.UseAuthentication();

app.UseAuthorization();




// פונקציה ליצירת JWT Token
object CreateJWT(User user, IConfiguration configuration)
{
    var claims = new List<Claim>()
    {
        new Claim("id", user.Id.ToString()),
        new Claim("name", user.Username),
        new Claim("email", user.Email),
    };

    var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]));
    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
    var tokenOptions = new JwtSecurityToken(
        issuer: configuration["JWT:Issuer"],
        audience: configuration["JWT:Audience"],
        claims: claims,
        expires: DateTime.Now.AddDays(30),
        signingCredentials: signinCredentials
    );

    var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
    return new { Token = tokenString };
}

app.MapGet("/", ()=> "Server API is running");
// Login
app.MapPost("/login", async ([FromBody] LoginModel loginModel, ToDoListContext db, IConfiguration configuration) =>
{
    var user = db.Users?.FirstOrDefault(u => u.Email == loginModel.Email && u.Password == loginModel.Password);
    if (user is not null)
    {
        var jwt = CreateJWT(user, configuration);
        return Results.Ok(jwt);
    }
    return Results.Unauthorized();
});

// Register
app.MapPost("/register", async ([FromBody] LoginModel loginModel, ToDoListContext db, IConfiguration configuration) =>
{
    var name = loginModel.Email.Split("@")[0];
    var lastId = await db.Users.MaxAsync(u => (int?)u.Id) ?? 0;
    var newUser = new User
    {
        Id = lastId + 1,
        Username = name,
        Email = loginModel.Email,
        Password = loginModel.Password,
    };

    db.Users?.Add(newUser);
    await db.SaveChangesAsync();

    var jwt = CreateJWT(newUser, configuration);
    return Results.Ok(jwt);
});




// GET: שליפת כל הפריטים של משתמש
app.MapGet("/items", async (HttpContext httpContext, ToDoListContext db) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == "id");
    if (userIdClaim == null)
    {
        return Results.Unauthorized();
    }

    var userId = int.Parse(userIdClaim.Value);

    var items = await db.Items.Where(i => i.UserId == userId).ToListAsync();
    return Results.Ok(items);
})
.RequireAuthorization();


// GET: שליפת פריט לפי מזהה
app.MapGet("/items/{id}", async (int id, ToDoListContext db) =>
{
    var item = await db.Items.FindAsync(id);
    return item != null ? Results.Ok(item) : Results.NotFound();
})
.RequireAuthorization();


// POST: הוספת פריט חדש
app.MapPost("/items", async (HttpContext httpContext, [FromBody] Item newItem, ToDoListContext db) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == "id");
    if (userIdClaim == null)
    {
        return Results.Unauthorized();
    }

    var userId = int.Parse(userIdClaim.Value);

    newItem.UserId = userId;

    db.Items.Add(newItem);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{newItem.Id}", newItem);
})
.RequireAuthorization();



// PUT: עדכון פריט קיים
app.MapPut("/items/{id}", async (HttpContext httpContext, int id, [FromBody] Item updatedItem, ToDoListContext db) =>
{
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == "id");
    if (userIdClaim == null)
    {
        return Results.Unauthorized();
    }

    var userId = int.Parse(userIdClaim.Value);

    var item = await db.Items.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
    if (item == null)
    {
        return Results.NotFound();
    }

    // עדכון הנתונים
    item.IsComplete = updatedItem.IsComplete;
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.RequireAuthorization();


// DELETE: מחיקת פריט לפי מזהה
app.MapDelete("/items/{id}", async (HttpContext httpContext, int id, ToDoListContext db) =>
{
    // שליפת UserId מתוך ה-Token
    var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == "id");
    if (userIdClaim == null)
    {
        return Results.Unauthorized();
    }

    var userId = int.Parse(userIdClaim.Value);

    var item = await db.Items.FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);
    if (item == null)
    {
        return Results.NotFound();
    }

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.RequireAuthorization();


app.Run();
