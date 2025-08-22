const form = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const descInput = document.querySelector("#descInput");
const taskList = document.querySelector("#taskList");
const captchaDiv = document.querySelector("#captchaDiv");
const captchaInput = document.querySelector("#captchaInput");
const verifyCaptcha = document.querySelector("#verifyCaptcha");
const reloadCaptcha = document.querySelector("#reloadCaptcha");
const captchaCanvas = document.querySelector("#captchaCanvas")
let tasks = [];
let currentTask = null;
let captchaCode = ""
if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    renderTasks();
}

function generateCaptcha(){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    captchaCode = '';
    for(let i=0;i<6;i++){
        captchaCode += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    const ctx = captchaCanvas.getContext('2d');
    ctx.clearRect(0,0,captchaCanvas.width,captchaCanvas.height)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0,0,captchaCanvas.width,captchaCanvas.height)
    ctx.font = '25px Arial';
    ctx.fillStyle = '#333';
    ctx.textBaseline = 'middle';
    ctx.fillText(captchaCode, 15, captchaCanvas.height/2)
    for(let i=0;i<5;i++){
        ctx.strokeStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
        ctx.beginPath();
        ctx.moveTo(Math.random()*captchaCanvas.width, Math.random()*captchaCanvas.height);
        ctx.lineTo(Math.random()*captchaCanvas.width, Math.random()*captchaCanvas.height);
        ctx.stroke();
    }
}

form.addEventListener("submit", function(e){
    e.preventDefault();
    const task = taskInput.value.trim();
    const desc = descInput.value.trim();
    if(task === "") return alert("Task cannot be empty!");
    currentTask = {task, desc};
    captchaDiv.style.display = "block";
    generateCaptcha();
})
verifyCaptcha.addEventListener("click", function(){
    if(captchaInput.value === captchaCode){
        tasks.push(currentTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks()
        taskInput.value = "";
        descInput.value = "";
        captchaInput.value = "";
        captchaDiv.style.display = "none";
        currentTask = null;
        alert("✅ Task added successfully!");
    } else {
        alert("❌ Incorrect CAPTCHA. Try again!");
        generateCaptcha();
        captchaInput.value = "";
    }
})
reloadCaptcha.addEventListener("click", generateCaptcha)
function renderTasks(){
    taskList.innerHTML = "";
    tasks.forEach((t,index)=>{
        const li = document.createElement("li");
        li.innerHTML = `<b>${t.task}</b> - ${t.desc} <button onClick="deleteTask(${index})">❌ Delete</button>`;
        taskList.appendChild(li);
    });
}
function deleteTask(index){
    tasks.splice(index,1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}