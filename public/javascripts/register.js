function registerHandler() {
    let registerBtn = document.getElementById('register');
    let loginBtn = document.getElementById('login');
    registerBtn.disabled = true;
    loginBtn.disabled = true;
    let keySize = 2048;
    let crypt = new JSEncrypt({default_key_size: keySize});
    // TODO: Implement below to show that the key is being created actively
    // var load = setInterval(function () {
    //     var text = $('#time-report').text();
    //     $('#time-report').text(text + '.');
    // }, 500);
    crypt.getKey( () => {
        // clearInterval(load); // Conjunction with above TODO
        let privateKey = crypt.getPrivateKey();
        let publicKey = crypt.getPublicKey();
        let user = {};
        user.username = document.getElementById('username').value;
        user.email = document.getElementById('email').value;
        user.display = document.getElementById('display').value;
        user.password = document.getElementById('password').value;
        user.pubKey = publicKey;
        localStorage.setItem('rsa-private', privateKey);
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        }).then(res => {
            res.text().then(txt => {
                console.log(txt);
            });
        })
    });


}