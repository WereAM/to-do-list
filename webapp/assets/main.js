const addNewTodoButton = document.getElementById("add-new-todo");
const createTodoButton = document.getElementById("create-todo");
const updateTodoButton = document.getElementById("update-todo");
const idField = document.getElementById("id-field");
const timeField = document.getElementById("time-field");
const bodyField = document.getElementById("body-field");
const todoList = document.querySelector(".todo-content");
const div = document.createElement("div");
const form = document.querySelector("#form");
const closeIcon = document.querySelector(".fa-times");
const img = document.querySelector("#todo");

updateTodoButton.style.display = "none"

let Todos = [];

// REST api

const displayAllTodos = () => {
	todoList.innerHTML = ""
	axios.get("http://localhost:8000/posts")
	.then(res => {	
		Todos = [...res.data]
		if (Todos.length == 0) {
			todoList.innerHTML += `
			<div class = "empty-todo">
			<img src="./assets/images/undraw_empty_xct9.png" alt="empty image" style="width: 50%;">
			<br>
			<span style="font-family: 'Fira Sans', sans-serif; font-size: 20px; font-weight: bold;">There are no todos yet...</span>
			<br>
			</div>
			`;
		} else {		
			for(let key in Todos){
				let todo = Todos[key];
				todoList.innerHTML += `
				<div data-id="${todo.id}" class="todo-content-item">
					<span class="todo-id">▪️ ${todo.id} ▪️</span>
					${
						todo.status === "Complete" ? `<span style="text-decoration: line-through;" class="todo-text">${todo.body}</span>` : `<span class="todo-text">${todo.body}</span>`}
						<span class="todo-date">Created at : ${todo.timestamp}</span>
					${
						todo.status === "Complete" ? `<span class="todo-status complete">▪️ ${todo.status} ▪️</span>` : `<span class="todo-status incomplete">▪️ ${todo.status} ▪️</span>`}
						<div style="display: flex; flex-direction: column; justify-content: space-around; align-items: center;" class="actions-window">
						<i class="far fa-edit"></i>
						<i class="far fa-trash-alt"></i>
						${todo.status === "Complete" ? "" : '<i class="fas fa-check"></i>'}
					</div>
				</div>
				`;
			};
		}
	})//.catch(err => console.log(err));
	.catch((err) => {
		todoList.innerHTML += `
		<div class = "empty-todo">
		<img src="./assets/images/nodata.png" alt="empty image" style="width: 50%;">
		<br>
		<span style="font-family: 'Fira Sans', sans-serif; font-size: 20px; font-weight: bold;">The server is down. Start your json server at localhost port 8000</span>
		<br>
		</div>
		`;
	});

	console.log(Todos);
}

displayAllTodos();

// 	const addTodo = () => {
// 	const id = idField.value;
// 	const timestamp = timeField.value;
// 	const body = bodyField.value;
// 	const status = "Not complete";
// 	Todos.push({id,timestamp, body, status})
// 	idField.value = "";
// 	timeField.value = "";
// 	bodyField.value = "";
// 	displayAllTodos();
// }

const addTodo = () => {
	const id = idField.value;
	const timestamp = timeField.value;
	const body = bodyField.value;
	const status = "Not complete";
	axios
    .post('http://localhost:3000/posts', {id,timestamp, body, status})
    .then(res => console.log(res.data))
    .catch(err => console.error(err));
	idField.value = "";
	timeField.value = "";
	bodyField.value = "";
	displayAllTodos();
}

const editTodo = (itemId) => {
	createTodoButton.style.display = "none"
	updateTodoButton.style.display = "block"
	const {id, timestamp, status, body} = Todos.filter(todo => todo.id == itemId)[0];

	// idField.value = id;
	// timeField.value = getTimeStamp();
	// bodyField.value = body;

	axios.get(`http://localhost:8000/posts/${itemId}`).then((res) => {
		(idField.value = res.data.id),
			(timeField.value = res.data.timestamp),
			(bodyField.value = res.data.body);
	});
}

const generateID = () => {
	let id = `${Math.random().toString(36).substr(2, 6)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 6)}`;
	return id;
}

const getTimeStamp = () => {
	let date = new Date();
	let time = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
	return time;
}

const addNewTodo = () => {
	idField.value = generateID();
	timeField.value = getTimeStamp();
}

const deleteTodo = (itemId) => {
	//Todos = Todos.filter(todo => todo.id != itemId);
	axios.delete(`http://localhost:8000/posts/${itemId}`);
	location.reload();
	displayAllTodos();
}

const updateTodo = () => {
	const todos = Todos.map(todo=>{
		if(todo.id === idField.value){
			todo.status = "Not complete";
			todo.body = bodyField.value;
			todo.timestamp = timeField.value;
			return todo;
		}else{
			return todo;
		}
	})

	axios.patch(`http://localhost:8000/posts/${id}`, { id, timestamp, body });

	Todos = todos;
	idField.value = "";
	timeField.value = "";
	bodyField.value = "";
	displayAllTodos();
	updateTodoButton.style.display = "none"
	createTodoButton.style.display = "block"
}

const markTodoAsComplete = (itemId) => {
	const todos = Todos.map(todo=>{
		if(todo.id === itemId){
			todo.status = "Complete";
			return todo;
		}else{
			return todo;
		}
	})

	axios.patch(`http://localhost:8000/posts/${itemId}`, { status: "Complete" });
	location.reload()

	Todos = todos;
	displayAllTodos();
}

todoList.addEventListener('click', (e)=>{

	const id = e.target.parentElement.parentElement.dataset.id;

	if(e.target.classList.contains('fa-edit')){
	  editTodo(id);
	}
	
	if(e.target.classList.contains('fa-trash-alt')) {
	  deleteTodo(id);
 	}

	if(e.target.classList.contains('fa-check')){
	  markTodoAsComplete(id);
	}
})

const closeAll = () => {
	form.style.display = "none";
	img.style.display = "block";
	closeIcon.style.display = "none";
	addNewTodoButton.style.display = "block";
};

addNewTodoButton.addEventListener('click', addNewTodo);
createTodoButton.addEventListener('click', addTodo);
updateTodoButton.addEventListener('click', updateTodo);
closeIcon.addEventListener("click", closeAll);