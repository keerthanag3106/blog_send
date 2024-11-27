let eye_icon=document.querySelector(".eye")
let paswrd=document.querySelector(".pass__wrd")
let email=document.querySelector(".mail")
let showPwd=false;
eye_icon.addEventListener("click",()=>{
    console.log("clicked "+showPwd);
    showPwd=!showPwd;
    if(!showPwd){
        paswrd.type="password";
        eye_icon.src="/assets/eye.png";
    }
    else{
        paswrd.type="text";
        eye_icon.src="/assets/eye_closed.png";
    }
})

// let submit_button=document.querySelector("#subutton");
// submit_button.addEventListener("click",()=>{
//     console.log(email.value);
//     console.log(paswrd.value);
//     if(email.value=="keer@gmail.com" && paswrd.value=="12345"){
//         // <a href="loginPage.html"></a>
//         // document.querySelector(".xyz").href="homeScreen.html";
//         window.location.href="http://www.w3schools.com";
//     }
//     else{
//         alert("Invalid credentials");
//     }
// })



// The issue is likely due to how the button's default behavior interacts with the JavaScript function changeScreen().
//  When you click the "Submit" button, the default behavior
//  of the button in a form is to submit the form, which 
//  can cause the page to refresh before your changeScreen() function completes






// event.preventDefault(): This method prevents the default action associated with the event. 
// In this case, it prevents the form from being submitted, allowing the JavaScript code to execute
//  the logic and redirect properly


// var credentials = [["keer@gmail.com","12345"],["rishi@abc.com","67890"]];

// function changeScreen(event){
//     event.preventDefault();
//     // console.log(email.value);
//     // console.log(paswrd.value);
//     var credentialsMatched = false;
//     // if(email.value=="keer@gmail.com" && paswrd.value=="12345"){
//     //     location.replace("homeScreen.html");
//     // }
//     // else{
//     //     alert("Invalid credentials");
//     // }
//     for(var i=0;i<credentials.length;i++){
//         if(email.value==credentials[i][0] && paswrd.value==credentials[i][1]){
//             location.replace("homeScreen.html");
//             credentialsMatched = true;
//         }
//     }
//     if(credentialsMatched == false){
//         alert("Invalid credentials");
//     }
// }
// let submit_signUp=document.querySelector("subSignButton")