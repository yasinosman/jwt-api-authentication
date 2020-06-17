const API = `http://localhost:3000/`

async function setUpUI(token){
    if(token === null || typeof token === 'undefined'){
        //Hide loading animation
        document.querySelector('#loading-container').classList.add('display-none')

        //Show logged-out elements
        document.querySelector('#logged-out').classList.remove('display-none')

        //Hide logged in elements
        document.querySelector('#logged-in').innerHTML = ''
        document.querySelector('#logged-in').classList.add('display-none')
    } else {
        //If there is a token, make an API call to get current user
        //First display loading animation
        document.querySelector('#loading-container').classList.remove('display-none')
        fetch(API+'users/currentUser', {headers: {'token':token}})
            .then(response => response.json())
            .then(data => {
                if(data.user){
                    //If the token is valid
                    const html = `<h2>Welcome Back ${data.user.name}</h2>
                    <button class="logout">Logout</button>`

                    //Hide loading animation
                    document.querySelector('#loading-container').classList.add('display-none')

                    //Hide logged out elements
                    document.querySelector('#logged-out').classList.add('display-none')

                    //Show logged in elements
                    document.querySelector('#logged-in').innerHTML = html
                    document.querySelector('#logged-in').classList.remove('display-none')

                } else {
                    //If token is invalid
                    //Hide loading animation
                    document.querySelector('#loading-container').classList.add('display-none')

                    //Hide logged in elements
                    document.querySelector('#logged-in').innerHTML = ''
                    document.querySelector('#logged-in').classList.add('display-none')

                    //Show logged-out elements
                    document.querySelector('#logged-out').classList.remove('display-none')
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
}

setUpUI(localStorage.getItem('token'))