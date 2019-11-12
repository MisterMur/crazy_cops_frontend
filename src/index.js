document.addEventListener('DOMContentLoaded', () => {
  const usersEndPoint = 'https://pure-brushlands-11828.herokuapp.com/api/v1/users';

  function getUsers() {
    fetch(usersEndPoint)
      .then(res => res.json())
      .then(json => console.log(json));
  };

  getUsers();
});
