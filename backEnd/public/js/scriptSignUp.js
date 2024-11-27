let eye_icon_password=document.querySelector(".eye")
let paswrd=document.querySelector(".pass__wrd")
let eye_icon_confirmpassword=document.querySelector(".eyee")
let confirmPaswrd=document.querySelector(".pass__wrdd")
// let email=document.querySelector(".mail")


let showPwd=false;
let showConfirmPwd=false;



eye_icon_password.addEventListener("click",()=>{
    console.log(paswrd.value);
    console.log("clicked "+showPwd+" password");
    showPwd=!showPwd;
    if(!showPwd){
        paswrd.type="password";
        eye_icon_password.src="/assets/eye.png";
    }
    else{
        paswrd.type="text";
        eye_icon_password.src="/assests/eye_closed.png";
    }
})


eye_icon_confirmpassword.addEventListener("click",()=>{
    console.log("clicked "+showConfirmPwd+"confirm");
    showConfirmPwd=!showConfirmPwd;
    if(!showConfirmPwd){
        confirmPaswrd.type="password";
        eye_icon_confirmpassword.src="assets/eye.png";
    }
    else{
        confirmPaswrd.type="text";
        eye_icon_confirmpassword.src="assets/eye_closed.png";
    }
})


async function handleSubmit(event){
    event.preventDefault();
    console.log("hiii");

    const name=document.querySelector('.nme').value;
    const email=document.querySelector('.eml').value;
    const password=document.querySelector('.pass__wrd').value;
    const cnfPassword=document.querySelector('.pass__wrdd').value;

    const userData={name,email,password}
    // console.log(userData)
    // console.log(cnfPassword)

    if(password==cnfPassword){
        try{
            const response=await fetch("/signUp",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(userData)
            });
    
            if(!response.ok){
                throw new Error(`HTTP error! status:${response.status}`);
            }
    
            const result=await response.json();
            console.log('User added:',result);
    
            document.getElementById('userForm').reset();
            alert('User added succesfully');
            location.replace('/login');

    
        }catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user: ' + error.message);
        }
    }
    else{
        alert("password and confirm password not same.")
    }
}

document.getElementById('subSignButton').addEventListener('click', handleSubmit);

// let submit_signUp=document.querySelector("subSignButton");
// function changeScreen(event){
//     event.preventDefault();
//     alert("Credentials saved succesfully, Please Login")
//     location.replace("loginPage.html");    
// }
