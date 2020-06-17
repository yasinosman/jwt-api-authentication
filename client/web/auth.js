//Register
const registerForm = document.querySelector('#form-register')
async function handleRegister(user={}){
    postData(API+'auth/register', user)
        .then(data=>{
            if(data.error){
                console.log(data.error.message)
                return document.querySelector('#p-register-form-error').innerHTML = data.error.message
            } else {
                //Save token into local storage
                localStorage.setItem('token', data.token)
                registerForm.reset()
                return setUpUI(data.token)
            }
        })
        .catch(error=>{
            console.log(error)
        })
}

registerForm.addEventListener('submit', e => {
    e.preventDefault()
    const name     = registerForm['register-name'].value
    const email    = registerForm['register-email'].value
    const password = registerForm['register-password'].value
    
    const user = {
        name,
        email,
        password
    }

    handleRegister(user)
})

//Login
const loginForm = document.querySelector('#form-login')
async function handleLogin(user={}){
    postData(API+'auth/login', user)
        .then(data=>{
            if(data.error){
                console.log(data.error.message)
                return document.querySelector('#p-login-form-error').innerHTML = data.error.message
            } else {
                //Save token into local storage
                localStorage.setItem('token', data.token)
                loginForm.reset()
                return setUpUI(data.token)
            }
        })
        .catch(error=>{
            console.log(error)
        })
}

loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const email    = loginForm['login-email'].value
    const password = loginForm['login-password'].value
    
    const user = {
        email,
        password
    }

    handleLogin(user)
})

//Logout
function handleLogout(){
    //Remove the token from local storage
    localStorage.removeItem('token')

    return setUpUI()
}

document.addEventListener('click', e => {
    if(e.target.classList.contains('logout')){
        return handleLogout()
    }
})

