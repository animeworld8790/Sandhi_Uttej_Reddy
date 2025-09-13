let points = 0;

// LOGIN SYSTEM
function login(event){
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorDiv = document.getElementById('loginError');

  if(username === "user" && password === "password"){
    errorDiv.textContent = "";
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('platform').style.display = 'block';
    initEditor(); // Initialize Monaco Editor after login
  } else {
    errorDiv.textContent = "Invalid username or password!";
  }
}

// DARK/LIGHT MODE
function setDarkMode(){
  document.body.style.backgroundColor = '#1e1e1e';
  document.body.style.color = '#f0f0f0';
  document.getElementById('darkBtn').classList.add('active');
  document.getElementById('lightBtn').classList.remove('active');
}

function setLightMode(){
  document.body.style.backgroundColor = 'white';
  document.body.style.color = 'black';
  document.getElementById('darkBtn').classList.remove('active');
  document.getElementById('lightBtn').classList.add('active');
}

// MONACO EDITOR INITIALIZATION
function initEditor(){
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs' }});
  require(['vs/editor/editor.main'], function(){
    window.editor = monaco.editor.create(document.getElementById('editor'), {
      value: "// JavaScript example\nfor(let i=1;i<=10;i++){\n  console.log(i);\n}",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout:true
    });
  });
}

// PYTHON RUNNER (Skulpt)
function runPython(code){
  let output='';
  function outf(text){ output+=text+'\n'; }
  Sk.configure({output:outf, read:builtinRead});
  Sk.importMainWithBody('<stdin>', false, code);
  return output;
}

function builtinRead(x){
  if(Sk.builtinFiles === undefined || Sk.builtinFiles['files'][x] === undefined)
    throw "File not found: "+x;
  return Sk.builtinFiles['files'][x];
}

// RUN CODE & AUTO-GRADE
function runCode(){
  const outputDiv=document.getElementById('output');
  outputDiv.textContent='';
  const lang=document.getElementById('languageSelect').value;
  const code=editor.getValue();
  let logs='';

  try{
    if(lang==='javascript'){
      const consoleLog=console.log;
      let logArr=[];
      console.log=function(...args){ logArr.push(args.join(' ')); };
      eval(code);
      logs=logArr.join('\n');
      console.log=consoleLog;
    } else if(lang==='python'){
      logs=runPython(code);
    }

    // AUTO-GRADING EXAMPLE
    const expected='1\n2\n3\n4\n5\n6\n7\n8\n9\n10';
    if(logs.trim()===expected){
      points+=10;
      document.getElementById('points').textContent=points;
      document.getElementById('badge').textContent='Number Master';
      outputDiv.classList.add('success'); outputDiv.classList.remove('error');
      logs+=' \n✔ Correct!';
    } else {
      outputDiv.classList.add('error'); outputDiv.classList.remove('success');
      logs+=' \n❌ Incorrect. Try again!';
    }
  } catch(err){
    logs='Error: '+err.message+'\n💡 Hint: Check your syntax or variable names.';
    outputDiv.classList.add('error'); outputDiv.classList.remove('success');
  }

  outputDiv.textContent=logs;
}

// DEFAULT DARK MODE
setDarkMode();