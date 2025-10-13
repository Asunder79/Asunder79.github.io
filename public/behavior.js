const repoContainer = document.querySelector('.siblingwrapper') //select this element, its the parent of repo cards
const buttons = document.querySelectorAll('.buttons'); //returns array of all elements with class button
const userURL = `https://api.github.com/users/Asunder79/repos`; //Formerly known as RAW_JSON


// async function loadRepos() {
//   try {
//     const response = await fetch('https://api.github.com/users/Asunder79/repos'); //fetch from this link.
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const repos = await response.json();
//     return repos;
//   } catch (error) {
//     console.error('Error fetching repos:', error);
//   }
// }

const USERNAME = 'Asunder79';
const BASE_URL = `https://api.github.com/users/${USERNAME}/repos`
const REPOS_PER_PAGE = 100; 
//doing this using the restAPI from github. Need pagination for the request.
async function fetchAllUserRepos() {
    let allRepos = [];
    let page = 1;
    let hasMorePages = true;
    while (hasMorePages) {
        const url = `${BASE_URL}?per_page=${REPOS_PER_PAGE}&page=${page}`; //build the URL
        console.log(`Fetching page ${page}...`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 403) {
                    throw new Error("Rate limit exceeded or forbidden access.");
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
            const repos = await response.json();
              //check if we reached the last page
            if (repos.length === 0 || repos.length < REPOS_PER_PAGE) {
                hasMorePages = false; // we have reached the last page
                return repos;
            }
            allRepos = allRepos.concat(repos); //add this page to the array
            page++;  //increment page
        } catch (error) {
            console.error("Failed to fetch repositories:", error);
            // Stop fetching on error
            hasMorePages = false; 
        }
    }
    console.log(`Successfully fetched ${allRepos.length} repositories.`);
    console.log(allRepos);
    renderRepoCards (allRepos);
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
        const repos = await fetchAllUserRepos(userURL); //function call, pass it the URL
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