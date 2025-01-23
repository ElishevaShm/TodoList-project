# **ToDoList Project**
A task management API built with ASP.NET Core and MySQL.

---

## **Overview**
The ToDoList project is a lightweight, server-side application for managing tasks. It supports basic CRUD operations (Create, Read, Update, Delete) and integrates seamlessly with a MySQL database, both locally and via cloud (e.g., Clever Cloud).

---

## **Features**
- **CRUD Operations**: Fully implemented task management features.
- **MySQL Integration**: Supports local and cloud-hosted databases.
- **Validation**: Ensures data integrity and consistency.
- **Modular Code Structure**: Clean and maintainable codebase using ASP.NET Core best practices.

---

## **Technologies Used**
- **Backend Framework**: ASP.NET Core
- **Database**: MySQL (via Pomelo Entity Framework)
- **ORM**: Entity Framework Core
- **Dependency Injection**: Built-in support in ASP.NET Core
- **Tools**: Visual Studio, MySQL Workbench
- **Hosting (optional)**: Clever Cloud

---

## **Getting Started**

### **Prerequisites**
- .NET 7 SDK or higher
- MySQL Server installed locally or hosted remotely
- Visual Studio or any other .NET-supported IDE

### **Installation Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/ElishevaShm/TodoList-project.git
   cd TodoList-project
Update the appsettings.json file with your MySQL connection string:


{
    "ConnectionStrings": {
        "ToDoList": "Server=your-server;Database=your-database;User=your-username;Password=your-password;"
    }
}
Apply database migrations:

dotnet ef database update
Run the project:

dotnet run
API Endpoints
Method	Endpoint	Description
GET	/api/todos	Retrieve all tasks
GET	/api/todos/{id}	Retrieve a specific task
POST	/api/todos	Create a new task
PUT	/api/todos/{id}	Update an existing task
DELETE	/api/todos/{id}	Delete a task
Future Enhancements
Add task filtering by priority or completion status.
Implement task deadlines with date fields.
Create user authentication and authorization for secure access.
