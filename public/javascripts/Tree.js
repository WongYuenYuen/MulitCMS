/**
 * Created by shara on 2014/4/28.
 */

var editFunctions = [{"title" : "添加下级目录", "onclickName" : "newNode"},
                     //{"title" : "修改名字", "onclickName" : "editName"},
                     {"title" : "修改内容结构" , "onclickName" : "editContentStructure"},
                     {"title" : "删除该目录", "onclickName": "removeNode"}];

var dataType = ["int", "varchar", "date", "folat", "double"];

var contentStructure = [];

window.onload = function () {
    document.getElementById("root").onclick = appendNode;
    document.getElementsByClassName("name")[0].onkeyup = treeKeyup;
    projects = new Array();
    index = 0;
}

function appendNode(){
    console.log(this);  //this为按下的那个按钮，即输入框后面的添加按钮
    var parent = this.parentElement;
    if (this.id == "root") {
        var num = index;
    	var projectName = this.previousElementSibling.value;
    }
    else{
        var num = this.id.substr(4);
        var parentName = this.previousElementSibling.value;
        var projectName = this.getElementsByTagName("input")[0].value;
    }
    console.log(projectName);
    
    var li = document.createElement("li");
    li.className = "doc";
    var div = document.createElement("div");
    var text = document.createElement("input");
    text.type = "text";
    text.className = "new-name";
    text.value = projectName;
    text.name = projectName;
    text.onchange = editName;
    div.id = "node" + num;
    div.className = "edit-div";

    var a = new Array();
    for (var i = 0; i < 3; i++) {
        a[i] = document.createElement("a");
        div.appendChild(a[i]);
        a[i].className = "edit-btn";
        a[i].title = editFunctions[i].title;
    }

    a[0].onclick = newNode;
    a[1].onclick = editContentStructure;
    a[2].onclick = removeNode;

    li.appendChild(text);
    li.appendChild(div);
    if (parent.lastElementChild == undefined || parent.lastElementChild.tagName != "UL") {
       
        var ul = document.createElement("ul");
        ul.appendChild(li);
        parent.className = "folder";
        parent.appendChild(ul);
    } else {
        var ul = parent.lastElementChild;
        ul.appendChild(li);
    }
    if (this.id == "root") {
        var h4 = document.createElement("h4");
        h4.innerHTML = projectName;
        document.getElementsByTagName("ul")[0].insertBefore(h4, li);
        
        projects[index] = {
            "name": projectName,
            "children": []
        };
        index++;
        console.log("root:   " + projects[index]);
    } else {
        var node = {
            "name": projectName,
            "children": []
        };
        traversalJson(projects[num], parentName, node, "add");
        console.log(projects[num]);
    }
    resizeWindow(false);
}
function traversalJson(project, parent, node, operation) {
    var x;
    console.log(project.name);
    if (project.name == parent) {
        switch (arguments[3]) {
        case "add":
            project.children.push(node);
            break;
        case "delete":
            project.children.remove(node);
            break;
        case "edit":
            project.name = node;  //parent为需要修改的节点name，node为改后的字符串
            break;
        }
    }
    for (x in project.children) {
        console.log(project.children);
        if (project.children[x].length != 0) {
            traversalJson(project.children[x], parent, node, operation);
        }
    }
}

function treeKeyup(e) {
    var keyCode = e.keyCode;
    if (keyCode == 13 || keyCode == 108)
        appendNode.bind(this.nextElementSibling)();
}

function newNode() {
    if (this.nextElementSibling.tagName == "DIV") {
        if (this.nextElementSibling.style.display == "none") {
           this.nextElementSibling.style.display = "";
   //          $(this).contents().animate({height:"136px",opacity: "1"},600);
        } else {
            this.nextElementSibling.style.display = "none";
 //           $(this).contents().animate({height:"0px",opacity: "0"},600);
        }
    } else {
        console.log("in new node");
        var div = document.createElement("div");
        div.className = "get-name-div";
        var name = document.createElement("input");
        name.type = "text";
        var button = document.createElement("input");
        button.type = "button";
        button.value = "添加";
        button.className = "correct";
        div.appendChild(name);
        div.appendChild(button);
        this.parentElement.insertBefore(div, this.nextElementSibling);
        name.onkeyup = function (e) {
            var keyCode = e.keyCode;
            if (keyCode == 13 || keyCode == 108) {
                appendNode.bind(this.parentElement.parentElement)();
                this.value = "";
                this.parentElement.style.display = "none";
            }

        };
        button.onclick = function () {
            this.parentElement.style.display = "none";
            appendNode.bind(button.parentElement.parentElement)();
            this.previousElementSibling.value = "";
        }
        }
}

function editName() {
	var num = this.nextElementSibling.id.substr(4);
    var project = projects[num];
    traversalJson(project, this.name , this.value, "edit");
    this.name = this.value;
    console.log(projects[num]);
}

function editContentStructure() {
    console.log("editContentStructure");
    
    
    var div = document.createElement("div");
    div.className = "edit-content-div";
    
    var colse = document.createElement("input");
    colse.type = "button";
    colse.className = "edit-content-div-colse";
    colse.onclick = function(){
        this.parentElement.style.display = "none";
    };
    div.appendChild(colse);
    
    var ul = document.createElement("ul");
    ul.className = "edit-content-input";
    var li = new Array();
    for( var i = 0; i < 5; i++){
        li[i] = document.createElement("li");
    	ul.appendChild(li[i]);
    }
    var name = document.createElement("input");
    name.type = "text";
    name.placeholder = "字段名";
    name.onselect = checkAdd;
    var i = document.createElement("i");
    i.className = "must";
    li[0].appendChild(name);
    li[0].appendChild(i);
    
    var type = document.createElement("select");
    type.onchange = checkAdd;
    var options = new Array();
    options[0] = document.createElement("option");
    options[0].innerHTML = "数据类型";
    type.appendChild(options[0]);
    for(var i = 1; i < 5; i++){
    	options[i] = document.createElement("option");
        options[i].innerHTML = dataType[i];
        options[i].value = type[i];
        type.appendChild(options[i]);
    }
    var i = document.createElement("i");
    i.className = "must";
    li[1].appendChild(type);
    li[1].appendChild(i);
    
    var length = document.createElement("input");
    length.type = "text";
    length.placeholder = "长度";
    li[2].appendChild(length);
    
    var addition = document.createElement("input");
    addition.type = "text";
    addition.placeholder = "附加内容";
    li[3].appendChild(addition);
    
    var button = document.createElement("input");
    button.type = "button";
    button.disabled = true;
    button.value = "添加";
    li[4].appendChild(button);
    
    var table = document.createElement("table");
    
    div.appendChild(ul);
    div.appendChild(table);
    window.parent.document.getElementsByTagName("body")[0].appendChild(div);
}

function removeNode() {
    console.log("removeNode");
}

function checkAdd(){
    var ul = window.parent.document.getElementsByClassName("edit-content-input")[0];
    console.log(ul.getElementsByTagName("input")[0].value);
    console.log(ul.getElementsByTagName("option")[0].selected);
    if(ul.getElementsByTagName("input")[0].value != '' && !ul.getElementsByTagName("option")[0].selected){
        console.log("correct");
        ul.lastElementChild.childNodes[0].className = "correct";
        ul.lastElementChild.childNodes[0].disabled = false;
    }else{
        console.log("erro");
        ul.lastElementChild.childNodes[0].className = "";
        ul.lastElementChild.childNodes[0].disabled = true;
    }
}