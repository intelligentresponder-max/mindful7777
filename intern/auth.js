const PASS = 'mindful7777';
function checkAuth(){
  if(localStorage.getItem('m7_intern') !== PASS){
    localStorage.setItem('m7_return', window.location.href);
    window.location.href = 'login.html';
  }
}
function doLogin(pw){
  if(pw === PASS){
    localStorage.setItem('m7_intern', pw);
    const ret = localStorage.getItem('m7_return') || 'dashboard.html';
    localStorage.removeItem('m7_return');
    window.location.href = ret;
  } else {
    document.getElementById('err').style.display = 'block';
  }
}
function doLogout(){
  localStorage.removeItem('m7_intern');
  window.location.href = 'login.html';
}
