const repoContainer = document.querySelector('.siblingwrapper') //select this element, its the parent of repo cards
const buttons = document.querySelectorAll('.buttons'); //returns array of all elements with class button
const userURL = `https://api.github.com/users/Asunder79/repos`; //Formerly known as RAW_JSON


async function loadRepos() {
  try {
    const response = await fetch('https://api.github.com/users/Asunder79/repos'); //fetch from this link.
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const repos = await response.json();
    return repos;
  } catch (error) {
    console.error('Error fetching repos:', error);
  }
}

function renderRepoCards(repoarray) {
    repoContainer.innerHTML = ''; 
    console.log("SUCCESFULLY FETCHED REPOS,CREATING CARDS NOW");
    if (!repoarray || repoarray.length === 0) { //if empty or error thrown
        repoContainer.innerHTML = '<p>No repos found.</p>';
        return;
    }

    repoarray
    .forEach(repo => {
      const createdDate = new Date(repo.created_at);
      const formattedDate = createdDate.toLocaleDateString('en-US');

      const repoCard = document.createElement('div'); //make the div
      repoCard.classList.add('repo-card'); //give it class repo-card

      repoCard.innerHTML = `
        <p class="details">Name: ${repo.name}</p> 
        <p class="details">Author: ${repo.owner.login}</p>
        <p class="details">HTML-Url: <a href="${repo.html_url}" target="_blank">${repo.html_url}</a></p>
        <p class="details">Description:${repo.description || 'No description provided.'}</p>
        <p class="details">Created On: ${formattedDate}</p>
      `;
      repoContainer.appendChild(repoCard); //repocontainer IS repo-card class.
    });
}

if (buttons[0]) {
    buttons[0].addEventListener('click', async () => {
        console.log("Fetching all repos...");
        const repos = await loadRepos(userURL); //function call, pass it the URL
        if (repos) {
            renderRepoCards(repos); //call the render function with the result of the fetch function
        }
    });
}

if (buttons[1]) {
    buttons[2].addEventListener('click', () => {
        console.log("Resetting view...");
        repoContainer.innerHTML = ''; // Clear the container of all its children
    });
}