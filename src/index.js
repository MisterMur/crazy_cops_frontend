document.addEventListener('DOMContentLoaded', () => {
  const usersEndPoint = 'http://localhost:3000/api/v1/users';

  function getUsers() {
    fetch(usersEndPoint)
      .then(res => res.json())
      .then(json => console.log(json));
  };

  getUsers();
});
