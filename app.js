// const { application } = require("express");
// // app.get('/login', (req, res) => {
// //     res.sendFile(path.join(__dirname, 'Blog_v1/loginPage.html'));
// // });

// async function handleSubmit(event){
//     event.preventDefault();
//     console.log("hiii")

//     const name=document.querySelector('.nme').value;
//     const email=document.querySelector('.eml').value;
//     const password=document.querySelector('.pass__wrd').value;
//     const cnfPassword=document.querySelector('.pass__wrdd').value;

//     const userData={name,email,password}
//     console.log(userData)
//     console.log(cnfPassword)

//     if(password==cnfPassword){
//         try{
//             const response=await fetch("http://localhost:8000/userDetails/add-user",{
//                 method:'POST',
//                 headers:{
//                     'Content-Type':'application/json'
//                 },
//                 body:JSON.stringify(userData)
//             });
    
//             if(!response.ok){
//                 throw new Error(`HTTP error! status:${response.status}`);
//             }
    
//             const result=await response.json();
//             console.log('User added:',result);
    
//             document.getElementById('userForm').reset();
//             alert('User added succesfully')
    
//             location.replace("C:/Users/gkeer/OneDrive/Desktop/blog_one/Blog_v1/loginPage.html");

//             // location.replace("Blog_v1/loginPage.html");

    
//         }catch (error) {
//             console.error('Error adding user:', error);
//             alert('Failed to add user: ' + error.message);
//         }
//     }
//     else{
//         alert("password and confirm password not same.")
//     }
// }

// document.getElementById('userForm').addEventListener('submit', handleSubmit);



// async function handleSubmitBtn(event){
//     event.preventDefault();
//     console.log("hiii")

    
//     const email=document.querySelector('.email').value;
//     const password=document.querySelector('.pass__wrd').value;
    

//     const userData={email,password}
//     // console.log(userData)

    

    
//     try{
        

//         const user=await User.findOne({email})
//         // console.log('User added:',result);
//         if(!user){
//             location.replace("C:/Users/gkeer/OneDrive/Desktop/blog_one/Blog_v1/signUp.html");
//         }

//         const checkPassword=await compare(password,user.password)

//         if(!checkPassword){
//             location.replace("C:/Users/gkeer/OneDrive/Desktop/blog_one/Blog_v1/signUp.html");
//         }
        


//     }catch (error) {
//         console.error('Error adding user:', error);
//         alert('Failed to add user: ' + error.message);
//     }

// }

// document.getElementById('userForm').addEventListener('submit', handleSubmit);