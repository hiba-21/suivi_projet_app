
const login = async (email, password) => {
    console.log(email,password);
    try{
        const res = await axios({
            method: 'POST',
            url:'http://127.0.0.1:8000/api/v1/users/login',
            data:{
                email:email,
                password:password
    
            }
        });
       if (res.data.status ==='success') {
          alert('Logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/')
            },1500);
        }
       console.log(res);
    }catch (err){
        alert(err.response.data);
       console.log('error',err.response.data);
    }
   
};
document.querySelector('.form').addEventListener('submit', e=>{
    e.preventDefault();
    //values
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
    
    login(email,password);
});
const logout = async () =>{
    try {
        const res = await axios({
            method: 'GET',
            url:'http://127.0.0.1:8000/api/v1/users/logout',
        });
        if (res.data.status='success') location.reload(true);
    } catch (err) {
        
        alert('error','Error logging out! try again')
    }
};
 document.querySelector('.nav__el--logout').addEventListener('click',logout);