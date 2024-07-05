document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("girenKullanici")) {
        showTodoApp();
        loadTodos();
    } else {
        showLogin();
    }
});

function showLogin() { // Varsayılan olarak açık olan ekran
    document.getElementById("register").style.display = "none";
    document.getElementById("auth").style.display = "block";
    document.getElementById("todo-app").style.display = "none";
}

function showRegister() { // Kayıt ekranını aktif etmek için
    document.getElementById("auth").style.display = "none";
    document.getElementById("todo-app").style.display = "none";
    document.getElementById("register").style.display = "block";
}

function showTodoApp() { // Giriş yaptıktan sonra aktif olan ekran
    document.getElementById("auth").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("todo-app").style.display = "block";
    const girenKullanici = JSON.parse(localStorage.getItem("girenKullanici"));
    const girenKullaniciBuyuk=girenKullanici.username.toUpperCase();
    document.getElementById("username-display").textContent = `${girenKullaniciBuyuk}'S TODO LIST`;

}

function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.username === username)) {
        alert("Kullanıcı zaten mevcut!");
        return;
    }
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Başarılı şekilde kayıt yapıldı.");
    showLogin();
}

function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        localStorage.setItem("girenKullanici", JSON.stringify(user));
        document.getElementById("login-username").value = "";
        document.getElementById("login-password").value = "";
        loadTodos();
        showTodoApp();
    } else {
        document.getElementById("login-username").value = "";
        document.getElementById("login-password").value = "";
        alert("Kullanıcı adı ya da parola hatalı!");
    }
}

function logout() {
    localStorage.removeItem("girenKullanici");
    showLogin();
}
function addTodo() {
    const todoText = document.getElementById("new-todo").value;
    if (!todoText) return;

    const girenKullanici = JSON.parse(localStorage.getItem("girenKullanici"));
    let todos = JSON.parse(localStorage.getItem("todos")) || {};
    if (!todos[girenKullanici.username]) {
        todos[girenKullanici.username] = [];
    }
    todos[girenKullanici.username].push({ text: todoText, status: 'Bekliyor' });
    localStorage.setItem("todos", JSON.stringify(todos));
    document.getElementById("new-todo").value = "";
    loadTodos();
}

function loadTodos(statusFilter = null) {
    const girenKullanici = JSON.parse(localStorage.getItem("girenKullanici"));
    let todos = JSON.parse(localStorage.getItem("todos")) || {};
    const userTodos = todos[girenKullanici.username] || [];

    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    userTodos.forEach((todo, index) => {
        if (!statusFilter || todo.status === statusFilter) {
            const li = document.createElement("li");
            li.classList.add("todo-item");

            const todoText = document.createElement("p");
            todoText.textContent = todo.text;

            const statusText = document.createElement("span");
            statusText.textContent = ` (${todo.status})`;
            statusText.style.color = getStatusColor(todo.status);

            const updateBtn = document.createElement("button");
            updateBtn.textContent = "Güncelle";
            updateBtn.classList.add("update-btn");
            updateBtn.onclick = () => updateTodo(index, todoText);

            const statusBtn = document.createElement("button");
            statusBtn.textContent = "Statü";
            statusBtn.classList.add("status-btn");
            statusBtn.onclick = () => changeStatus(index);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Sil";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.onclick = () => deleteTodo(index);

            const btnContainer = document.createElement("div");
            btnContainer.classList.add("btn-container");
            btnContainer.appendChild(updateBtn);
            btnContainer.appendChild(deleteBtn);
            btnContainer.appendChild(statusBtn);

            li.appendChild(todoText);
            li.appendChild(statusText);
            li.appendChild(btnContainer);

            todoList.appendChild(li);
        }
    });
}

function updateTodo(index, todoTextElement) {
    const todoText = todoTextElement.textContent.trim();
    const input = document.createElement("input");
    input.type = "text";
    input.value = todoText;

    input.addEventListener("change", function () {
        const newTodoText = input.value.trim();
        if (newTodoText && newTodoText !== todoText) {
            const girenKullanici = JSON.parse(localStorage.getItem("girenKullanici"));
            let todos = JSON.parse(localStorage.getItem("todos")) || {};
            todos[girenKullanici.username][index].text = newTodoText;
            localStorage.setItem("todos", JSON.stringify(todos));
            loadTodos();
        }
    });
    todoTextElement.innerHTML = '';
    todoTextElement.appendChild(input);

    input.focus();
}

function changeStatus(index) {
    const girenKullanici = JSON.parse(localStorage.getItem("girenKullanici"));
    let todos = JSON.parse(localStorage.getItem("todos")) || {};
    const currentStatus = todos[girenKullanici.username][index].status;

    switch (currentStatus) {
        case 'Bekliyor':
            todos[girenKullanici.username][index].status = 'Devam Ediyor';
            break;
        case 'Devam Ediyor':
            todos[girenKullanici.username][index].status = 'Tamamlandı';
            break;
        case 'Tamamlandı':
            todos[girenKullanici.username][index].status = 'Bekliyor';
            break;
    }

    localStorage.setItem("todos", JSON.stringify(todos));
    loadTodos();
}

function deleteTodo(index) {
    const girenKullanici = JSON.parse(localStorage.getItem("girenKullanici"));
    let todos = JSON.parse(localStorage.getItem("todos")) || {};
    todos[girenKullanici.username].splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    loadTodos();
}

function filterTodos(status) {
    loadTodos(status);
}

function getStatusColor(status) {
    switch (status) {
        case 'Bekliyor':
            return 'red';
        case 'Devam Ediyor':
            return 'blue';
        case 'Tamamlandı':
            return 'green';
        default:
            return 'black';
    }
}