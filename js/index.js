const gitHubForm = document.querySelector('body form#github-form')
const gitHubApi = 'https://api.github.com'
const requestHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    }
const userList = document.querySelector('body div#github-container ul#user-list')
const repoList = document.querySelector('body div#github-container ul#repos-list')

gitHubForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const searchValue = event.target.search.value
    const searchPath = event.target['search-type'].value
    clearList(userList)
    clearList(repoList)
    searchKeyword(searchPath, searchValue)
    event.target.reset()
})

// API Call
function searchKeyword(searchPath, searchTerm) {
    fetch (`${gitHubApi}/search/${searchPath}?q=${searchTerm}&per_page=5`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (object => object.items.forEach(item => {
        let containerNode
        let listItem = document.createElement('li')

        if (searchPath === 'users') {
            containerNode = userList
            listItem = createUserItem(item)
        }
        else {
            containerNode = repoList
            listItem = createRepoItem(item)
        }
        containerNode.appendChild(listItem)
    }))
    .catch (error => console.error(`${error.message}`))
}

// API Call
function searchUserRepos(username) {
    fetch (`${gitHubApi}/users/${username}/repos`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (array => array.forEach(item => {
        let listItem = createRepoItem(item)
        repoList.appendChild(listItem)
    }))
    .catch (error => console.log(error.message))
}

// API Call
function getUser(username) {
    fetch (`${gitHubApi}/users/${username}`, {
        method: 'GET',
        headers: requestHeaders
    })
    .then (response => response.json())
    .then (object => userList.appendChild(createUserItem(object)))
    .catch(error => console.log(error.message))
}

// Helper functions
function createUserItem(userObject) {
    let newListItem = document.createElement('li')
    newListItem.className = 'github-user'
    newListItem.innerHTML = `
        <img src="${userObject.avatar_url}" class="avatar-img" id="user-${userObject.id}">
        <br>
        <a href="${userObject.html_url}" target="_blank">${userObject.login}</a>
    `
    newListItem.querySelector('img').addEventListener('click', () => handleAvatarClick(userObject.login))
    return newListItem
}

function createRepoItem(repoObject) {
    let newListItem = document.createElement('li')
    newListItem.className = 'github-repo'
    newListItem.innerHTML = `
        <a href="${repoObject.html_url}" target="_blank" id="repo-${repoObject.id}">${repoObject.name}</a>
        <br>
        <p id="repo-owner-${repoObject.owner.id}">Repo Owner: ${repoObject.owner.login}</p>
    `
    newListItem.querySelector('p').addEventListener('click', () => handleUsernameClick(repoObject.owner.login))
    return newListItem
}

function handleAvatarClick(username) {
    clearList(repoList)
    searchUserRepos(username)
}

function handleUsernameClick(username) {
    clearList(userList)
    getUser(username)
}

function clearList(nodeList) {
    let list = nodeList.querySelectorAll(`li`)
    list.forEach(node => node.remove())
}